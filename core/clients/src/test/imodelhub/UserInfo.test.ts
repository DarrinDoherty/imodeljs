/*---------------------------------------------------------------------------------------------
* Copyright (c) 2018 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";

import { TestConfig } from "../TestConfig";

import { AccessToken } from "../../Token";
import { ResponseBuilder, ScopeType, RequestType } from "../ResponseBuilder";
import * as utils from "./TestUtils";
import { TestUsers } from "../TestConfig";
import { UserInfoQuery, HubUserInfo, UserInfo, IModelHubClientError, IModelClient } from "../..";
import { IModelHubStatus, ActivityLoggingContext, GuidString } from "@bentley/bentleyjs-core";

function mockGetUserInfo(imodelId: GuidString, userInfo: HubUserInfo[], query?: string) {
  if (!TestConfig.enableMocks)
    return;

  const requestResponse = ResponseBuilder.generateGetArrayResponse<HubUserInfo>(userInfo);
  let requestPath;
  if (query === undefined) {
    requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "UserInfo", "$query");
    ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Post, requestPath, requestResponse);
  } else {
    requestPath = utils.createRequestUrl(ScopeType.iModel, imodelId, "UserInfo", `${query ? query : ""}`);
    ResponseBuilder.mockResponse(utils.IModelHubUrlMock.getUrl(), RequestType.Get, requestPath, requestResponse);
  }
}

function generateHubUserInfo(userInfos: UserInfo[]): HubUserInfo[] {
  const users: HubUserInfo[] = [];
  userInfos.forEach((user: UserInfo) => {
    const userInfo = new HubUserInfo();
    userInfo.id = user.id;
    userInfo.firstName = user.profile!.firstName;
    userInfo.lastName = user.profile!.lastName;
    userInfo.email = user.email!.id;
    users.push(userInfo);
  });
  return users;
}

describe("iModelHubClient UserInfoHandler", () => {
  const accessTokens: AccessToken[] = [];
  let imodelId: GuidString;
  const actx = new ActivityLoggingContext("");

  const imodelName = "imodeljs-clients UserInfo test";
  const imodelHubClient: IModelClient = utils.getDefaultClient();

  before(async function (this: Mocha.IHookCallbackContext) {
    accessTokens.push(TestConfig.enableMocks ? new utils.MockAccessToken() : await utils.login(TestUsers.super));
    accessTokens.push(TestConfig.enableMocks ? new utils.MockAccessToken() : await utils.login(TestUsers.manager));

    accessTokens.sort((a: AccessToken, b: AccessToken) => a.getUserInfo()!.id.localeCompare(b.getUserInfo()!.id));
    await utils.createIModel(accessTokens[0], imodelName);
    imodelId = await utils.getIModelId(accessTokens[0], imodelName);

    if (!TestConfig.enableMocks) {
      await utils.getBriefcases(accessTokens[0], imodelId, 1);
      await utils.getBriefcases(accessTokens[1], imodelId, 1);
    }
  });

  afterEach(() => {
    ResponseBuilder.clearMocks();
  });

  it("should get one user info", async function (this: Mocha.ITestCallbackContext) {
    if (TestConfig.enableMocks) {
      const mockedUserInfo = generateHubUserInfo([accessTokens[0].getUserInfo()!]);
      mockGetUserInfo(imodelId, mockedUserInfo, `${mockedUserInfo[0].id}`);
    }

    const query = new UserInfoQuery().byId(accessTokens[0].getUserInfo()!.id);
    const userInfo = (await imodelHubClient.users.get(actx, accessTokens[0], imodelId, query));
    chai.assert(userInfo);
    chai.expect(userInfo.length).to.be.equal(1);
    chai.expect(userInfo[0].id).to.be.equal(accessTokens[0].getUserInfo()!.id);
    chai.expect(userInfo[0].firstName).to.be.equal(accessTokens[0].getUserInfo()!.profile!.firstName);
    chai.expect(userInfo[0].lastName).to.be.equal(accessTokens[0].getUserInfo()!.profile!.lastName);
  });

  it("should get several users info", async function (this: Mocha.ITestCallbackContext) {
    if (TestConfig.enableMocks) {
      const mockedUsersInfo = generateHubUserInfo([accessTokens[0].getUserInfo()!, accessTokens[1].getUserInfo()!]);
      mockGetUserInfo(imodelId, mockedUsersInfo);
    }

    const query = new UserInfoQuery().byIds(
      [accessTokens[0].getUserInfo()!.id,
      accessTokens[1].getUserInfo()!.id]);
    const userInfo = (await imodelHubClient.users.get(actx, accessTokens[0], imodelId, query));
    userInfo.sort((a: HubUserInfo, b: HubUserInfo) => a.id!.localeCompare(b.id!));
    chai.assert(userInfo);
    chai.expect(userInfo.length).to.be.equal(2);
    for (let i = 0; i < 2; ++i) {
      chai.expect(userInfo[i].id).to.be.equal(accessTokens[i].getUserInfo()!.id);
      chai.expect(userInfo[i].firstName).to.be.equal(accessTokens[i].getUserInfo()!.profile!.firstName);
      chai.expect(userInfo[i].lastName).to.be.equal(accessTokens[i].getUserInfo()!.profile!.lastName);
    }
  });

  it("should fail to get users without ids", async () => {
    let error: IModelHubClientError | undefined;
    try {
      await imodelHubClient.users.get(actx, accessTokens[0], imodelId, new UserInfoQuery().byIds([]));
    } catch (err) {
      if (err instanceof IModelHubClientError)
        error = err;
    }
    chai.assert(error);
    chai.expect(error!.errorNumber!).to.be.equal(IModelHubStatus.InvalidArgumentError);
  });
});

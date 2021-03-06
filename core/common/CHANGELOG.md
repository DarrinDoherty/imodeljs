# Change Log - @bentley/imodeljs-common

This log was last generated on Mon, 03 Dec 2018 18:52:58 GMT and should not be manually modified.

## 0.171.0
Mon, 03 Dec 2018 18:52:58 GMT

### Updates

- Polyfill URLSearchParams for edge.
- Front end "read pixels" can now provide subCategoryId and GeometryClass to backend.

## 0.170.0
Mon, 26 Nov 2018 19:38:42 GMT

### Updates

- Fix GeometryParams constructor. Added test to ensure subcategory id set correctly.
- Remove dependency on 'window'-named global object.

## 0.169.0
Tue, 20 Nov 2018 16:17:15 GMT

### Updates

- GeometryStream markdown

## 0.168.0
Sat, 17 Nov 2018 14:20:11 GMT

*Version update only*

## 0.167.0
Fri, 16 Nov 2018 21:45:44 GMT

### Updates

- Add CartographicRange
- Use URL query instead of path segment for cacheable RPC request parameters.
- Updated Mobile RPC to deal with binary data
- Temporarily disable tile caching.

## 0.166.0
Mon, 12 Nov 2018 16:42:10 GMT

*Version update only*

## 0.165.0
Mon, 12 Nov 2018 15:47:00 GMT

*Version update only*

## 0.164.0
Thu, 08 Nov 2018 17:59:20 GMT

### Updates

- Fix JSON representation of display styles.
- GeoJson and Analysis Importer simplification
- ModelSelectorProps, CategorySelectorProps, and DisplayStyleProps now properly extend DefinitionElementProps
- Support displacement scale for PolyfaceAuxData
- Do not diffentiate between backend provisioning and imodel downloading state in RPC wire format (202 for all).
- Updated to TypeScript 3.1

## 0.163.0
Wed, 31 Oct 2018 20:55:37 GMT

### Updates

- Fully support mixed binary and JSON content in both directions in RPC layer. RPC system internal refactoring. Basic support for cacheable RPC requests.
- Remove unused RpcInterface methods, move WIP methods

## 0.162.0
Wed, 24 Oct 2018 19:20:06 GMT

### Updates

- Added view decoration examples to docs.
- Make ToolAdmin.defaultTool. public. Allow getToolTip to return HTMLElement | string.
- Breaking changes to optimize usage of 64-bit IDs.
- Remove unused createAndInsert methods from IModelWriteRpcInterface
- Correctly parse RPC interface versions with zero major component.
- Add RpcInterface versioning documentation

## 0.161.0
Fri, 19 Oct 2018 13:04:14 GMT

*Version update only*

## 0.160.0
Wed, 17 Oct 2018 18:18:38 GMT

*Version update only*

## 0.159.0
Tue, 16 Oct 2018 14:09:09 GMT

*Version update only*

## 0.158.0
Mon, 15 Oct 2018 19:36:09 GMT

*Version update only*

## 0.157.0
Sun, 14 Oct 2018 17:20:06 GMT

*Version update only*

## 0.156.0
Fri, 12 Oct 2018 23:00:10 GMT

### Updates

- Initial release


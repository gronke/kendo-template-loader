# kendo-template-loader
Async Kendo Template Loader

### Install
```bash
bower install kendo-template-loader
```

### Build
```bash
gulp build
```

### Tests

Tests are stored in `./test` directory.

```bash
gulp test
```

### Templates from nested directories
Templates can be loaded from nested directories via `data-template` attribute by replacing `/` with two subsequent dashes `--`, e.g. `directory--template-file`.

### ToDo
- Write Tests for custom template file and name `{ file: 'path/to/file', name 'custom-file-template' }`

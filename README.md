# NPM package template

Шаблонный репозиторий для TS-пакета в NPM registry

## Как с этим работать?
Есть всего два метода:

### 1. setOptions(options)
Устанавливает разрешенные теги и прочие настройки белого списка фильтрации

### 2. sanitize(input)
Возвращает строку санитизированного html текста

## Пример
```ts
import SanitizeHTML from "@sergtyapkin/sanitize-html-es6";

SanitizeHTML.setOptions({
  AllowedTags: SanitizeHTML.AllowedTags.concat(['SCRIPT'])
  // AllowedAttributes: ...,
  // AllowedCssStyles: ...,
  // AllowedHrefSchemas: ...,
  // AllowedContentTags: ...,
  // AllowedUriAttributes: ...,
  // AllowedIframeHosts: ...,
});

const result = SanitizeHTML.sanitize('<img src="http://some.site:3000/image/some.png" alt="image" onerror="const evil = \'code\'"><div><i>Some</i> <b>text</b></div>');
```

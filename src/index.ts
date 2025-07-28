class SanitizeHTML {
  _parser: DOMParser;

  AllowedIframeHosts: string[];
  AllowedTags: string[];
  AllowedAttributes: string[];
  AllowedCssStyles: string[];
  AllowedHrefSchemas: string[];
  AllowedContentTags: string[];
  AllowedUriAttributes: string[];


  constructor() {
    this.AllowedTags = [
      'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BODY', 'BR', 'CENTER', 'CODE', 'DD', 'DIV', 'DL', 'DT', 'EM',
      'FONT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'LABEL', 'LI', 'OL', 'P', 'PRE',
      'SMALL', 'SOURCE', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'THEAD',
      'UL', 'U', 'VIDEO', 'IFRAME',
    ];
    this.AllowedAttributes = [
      'align', 'color', 'controls', 'height', 'href', 'id', 'src', 'style', 'target', 'title', 'type', 'width',
    ];
    this.AllowedCssStyles = [
      'background-color', 'color', 'font-size', 'font-weight', 'text-align','text-decoration', 'width',
    ];
    this.AllowedHrefSchemas = [
      'http:', 'https:', 'data:', 'm-files:', 'file:', 'ftp:', 'mailto:', 'pw:',
    ];
    this.AllowedContentTags = [
      'FORM', 'GOOGLE-SHEETS-HTML-ORIGIN',
    ]; //tags that will be converted to DIVs
    this.AllowedUriAttributes = [
      'href', 'action',
    ];
    this.AllowedIframeHosts = [
      'www.youtube.com', 'www.tiktok.com', 'instagram.com', 'facebook.com', 'dailymotion.com', 'hulu.com',
      'www.crunchyroll.com', 'www.netflix.com', 'vimeo.com', 'kinescope.io', '9gag.com', 'www.twitch.tv',
      'www.veoh.com'
    ];

    this._parser = new DOMParser();
  }

  setOptions(options: {
    AllowedTags?: string[],
    AllowedAttributes?: string[],
    AllowedCssStyles?: string[],
    AllowedHrefSchemas?: string[]
    AllowedContentTags?: string[]
    AllowedUriAttributes?: string[]
    AllowedIframeHosts?: string[]
  }) {
    this.AllowedTags = options.AllowedTags || this.AllowedTags;
    this.AllowedAttributes = options.AllowedAttributes || this.AllowedAttributes;
    this.AllowedCssStyles = options.AllowedCssStyles || this.AllowedCssStyles;
    this.AllowedHrefSchemas = options.AllowedHrefSchemas || this.AllowedHrefSchemas;
    this.AllowedContentTags = options.AllowedContentTags || this.AllowedContentTags;
    this.AllowedUriAttributes = options.AllowedUriAttributes || this.AllowedUriAttributes;
    this.AllowedIframeHosts = options.AllowedIframeHosts || this.AllowedIframeHosts;
  }


  sanitize(input: string, extraSelector?: string) {
    input = input.trim();
    if (input == '') return; //to save performance

    //firefox "bogus node" workaround for wysiwyg's
    if (input == '<br>') return;

    if (input.indexOf('<body') == -1) input = '<body>' + input + '</body>'; //add "body" otherwise some tags are skipped, like <style>

    const doc = this._parser.parseFromString(input, 'text/html');

    //DOM clobbering check (damn you firefox)
    if (doc.body.tagName !== 'BODY')
      doc.body.remove();
    if (typeof doc.createElement !== 'function')
      // @ts-expect-error remove() for some browsers
      doc.createElement.remove();

    const resultElement = this.#makeSanitizedCopy(doc, doc.body, extraSelector);

    return resultElement.innerHTML
      .replace(/div><div/g, 'div>\n<div'); //replace is just for cleaner code
  }


  #makeSanitizedCopy(doc: Document, node: HTMLElement, extraSelector?: string) {
    let newNode;
    if (node.nodeType == Node.TEXT_NODE) {
      newNode = node.cloneNode(true);
    } else if (node.nodeType == Node.ELEMENT_NODE && (this.AllowedTags.includes(node.tagName) || this.AllowedContentTags.includes(node.tagName) || (extraSelector && node.matches(extraSelector)))) { //is tag allowed?

      if (this.AllowedContentTags.includes(node.tagName))
        newNode = doc.createElement('DIV'); //convert to DIV
      else
        newNode = doc.createElement(node.tagName);

      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (this.AllowedAttributes.includes(attr.name)) {
          if (attr.name == 'style') {
            for (let s = 0; s < node.style.length; s++) {
              const styleName = node.style[s];
              if (this.AllowedCssStyles.includes(styleName))
                newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName));
            }
          } else {
            if (this.AllowedUriAttributes.includes(attr.name)) { //if this is a "uri" attribute, that can have "javascript:" or something
              if (attr.value.indexOf(':') > -1 && !this.#startsWithAny(attr.value, this.AllowedHrefSchemas))
                continue;
            } else if (attr.name === 'src' && node.tagName === 'IFRAME') { //if this is a "src" in iframe
              let url;
              try {
                url = new URL(attr.value);
              } catch {
                return doc.createDocumentFragment() as unknown as HTMLElement;
              }
              if (!this.AllowedIframeHosts.includes(url.hostname))
                return doc.createDocumentFragment() as unknown as HTMLElement;
            }
            newNode.setAttribute(attr.name, attr.value);
          }
        }
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        const subCopy = this.#makeSanitizedCopy(doc, node.childNodes[i] as HTMLElement, extraSelector);
        // @ts-expect-error false for some browsers
        newNode.appendChild(subCopy, false);
      }

      //remove useless empty spans (lots of those when pasting from MS Outlook)
      if ((newNode.tagName == 'SPAN' || newNode.tagName == 'B' || newNode.tagName == 'I' || newNode.tagName == 'U')
        && newNode.innerHTML.trim() == '') {
        return doc.createDocumentFragment() as unknown as HTMLElement;
      }
    } else {
      newNode = doc.createDocumentFragment();
    }
    return newNode as HTMLElement;
  };


  #startsWithAny(str: string, substrings: string[]) {
    for (let i = 0; i < substrings.length; i++) {
      if (str.indexOf(substrings[i]) == 0) {
        return true;
      }
    }
    return false;
  }
}

export default new SanitizeHTML();

export const checksums = {
  "index": "v3.5.0--e3w1MhK6drgElAsvfWTiEDSZls56FNdk8g6AZpVxXwk",
  "projects": "v3.5.0--LAz8vbNe1Bgs24khehuS8QXwfa8XidVQnYzdCq6mwl0",
  "blog": "v3.5.0--PMMhvgGFocAPWVLx3gMtIzP4fDKba6Sbn_0u9hWJAMk",
  "pages": "v3.5.0--AYusCt1za6zfcNkb030AVX6OZnEzKorAyHOuzxvWSYw",
  "speaking": "v3.5.0--mx3wcXExXsrpiL3ywmz6_l1aKNy9k5ZmsvbIyKUasJQ",
  "about": "v3.5.0--Z7aPrwVAZpJVESqWdgWjDVECMdK96RFDWWkeX8tjVCQ"
}
export const checksumsStructure = {
  "index": "OlB8K-FYQeiOmH_XYZUPmjxYW6W3oRCq3ruT1Br3SAE",
  "projects": "_jGg9QdcBGRmD2dMkbPLVfDFdmrAfSojNRqSHIw4AIY",
  "blog": "PMMhvgGFocAPWVLx3gMtIzP4fDKba6Sbn_0u9hWJAMk",
  "pages": "Xrt8uVflp8qSGRfycVHjH6fS7_vYIJ0G0iDRF4PmBHc",
  "speaking": "mx3wcXExXsrpiL3ywmz6_l1aKNy9k5ZmsvbIyKUasJQ",
  "about": "cSh3bAOQqx8VA9CKDoYPGjMVYITfPX7k15c6OtFb2uM"
}

export const tables = {
  "index": "_content_index",
  "projects": "_content_projects",
  "blog": "_content_blog",
  "pages": "_content_pages",
  "speaking": "_content_speaking",
  "about": "_content_about",
  "info": "_content_info"
}

export default {
  "index": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "about": "json",
      "blog": "json",
      "body": "json",
      "description": "string",
      "experience": "json",
      "extension": "string",
      "faq": "json",
      "hero": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string",
      "testimonials": "json"
    }
  },
  "projects": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "date": "date",
      "description": "string",
      "extension": "string",
      "featured": "boolean",
      "gallery": "json",
      "image": "string",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string",
      "tags": "json"
    }
  },
  "blog": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "author": "json",
      "body": "json",
      "date": "date",
      "description": "string",
      "extension": "string",
      "image": "string",
      "meta": "json",
      "minRead": "number",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "pages": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "description": "string",
      "extension": "string",
      "links": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "speaking": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "description": "string",
      "events": "json",
      "extension": "string",
      "links": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "about": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "content": "json",
      "description": "string",
      "extension": "string",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "projects": "json",
      "seo": "json",
      "stem": "string"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}
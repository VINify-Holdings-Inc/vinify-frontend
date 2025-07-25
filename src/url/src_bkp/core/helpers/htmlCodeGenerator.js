const HtmlCodeGenerator = {
  MailChimp: ({ id, video, poster, img, width }) =>
    `<span id="${id}"><video style="width: ${width ? `${width}px` : '100%'
    }" controls playsinline autoplay muted poster="${poster}" src="${video}"><a href="*|ARCHIVE|*"><img style="width: ${width ? `${width}px` : '100%'
    }" src="${img}"/></a></video></span>`,
  CampaignMonitor: ({ id, video, poster, img, width }) =>
    `<span id="${id}"><video style="width: ${width ? `${width}px` : '100%'
    }" controls playsinline autoplay muted poster="${poster}" src="${video}"><a href="[webversion]"><img style="width: ${width ? `${width}px` : '100%'
    }" src="${img}"/></a></video></span>`,
  Salesforce: ({ id, video, poster, img, width }) =>
    `<span id="${id}"><video style="width: ${width ? `${width}px` : '100%'
    }" controls playsinline autoplay muted poster="${poster}" src="${video}"><a href="%%view_email_url%%"><img style="width: ${width ? `${width}px` : '100%'
    }" src="${img}"/></a></video></span>`,
  Others: ({ id, video, poster, img, href, width }) =>
    `<span id="${id}"><video style="width: ${width ? `${width}px` : '100%'
    }" controls playsinline autoplay muted poster="${poster}" src="${video}"><a href="${href}"><img style="width: ${width ? `${width}px` : '100%'
    }" src="${img}"/></a></video></span>`,
};

export default HtmlCodeGenerator;

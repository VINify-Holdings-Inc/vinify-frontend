import React, { Component } from "react";

import "./ExportSnippet.scss";

import { CheckBox, TextBox, Button, Select, Icon } from "../../html";

import formValidator from "../../../core/services/formValidator";
import { GetSnippetHtmlCode } from "../../../actions/snippet";
import notification from "../../../core/services/alert";
import sitemap from "../../../sitemap";

class ExportSnippet extends Component {
  //State

  state = {
    speakerIcon:
      "<img src='http://campaign.eyemailinc.com/dev/res/img/clip/header-speaker.png' align='top' />",
    downloadForm: {
      headerText: {
        value: "If Unable to See or Hear, Click Here",
        id: "headerText",
        label: "Header Text",
        showLabel: false,
        required: true,
        validator: (value) => value != "",
        placeholder: "Header text here",
        type: "text",
        autoFocus: true,
        errorMessage: "Please enter header text!",
        onChange: (event) => this._onChange(event),
        fluid: true,
      },
      includeHeader: {
        value: true,
        validator: () => true,
        title: "Include default email header",
        id: "includeHeader",
        className: "check-include-header",
        onChange: (event) => this._onClickInlcudeHeader(event),
      },
      includeUnsubscribeLink: {
        value: false,
        validator: () => true,
        title: "Include hidden unsubscribe link",
        id: "includeUnsubscribeLink",
        className: "check-include-unsubscribe",
        onChange: (event) => this._onClickIncludeUnsubscribe(event),
      },
      removeEyeMailBranding: {
        value: false,
        validator: () => true,
        title: "Remove EyeMail branding",
        id: "removeEyeMailBranding",
        className: "check-remove-branding",
        onChange: (event) => this._onClickRemoveEyeMailBranding(event),
      },
      platform: {
        label: "Email Platform",
        options: this.props.platforms,
        value: "",
        fluid: true,
        selection: true,
        id: "platform",
        name: "platform",
        placeholder: "Select platform",
        onChange: (event) => this._onChange(event),
      },
    },
    html: "-",
    copied: false,
  };

  componentDidMount = async () => {
    await this._handleGenerateCode();
  };

  // Events

  _onChange = (event, key) => {
    let downloadForm = this.state.downloadForm;
    downloadForm[event.target.name].value = event.target.value;
    this.setState(
      {
        downloadForm: downloadForm,
      },
      this._handleGenerateCode
    );
  };

  _handleGenerateCode = async () => {
    let res = await GetSnippetHtmlCode(
      this.props.snippet.snippet,
      this.state.downloadForm.platform.value
    );
   // console.log("html res",res, this.props.snippet);
    if (res.result) {
      this.setState({
        html: res.body,
      });
    } else {
      notification.error("Failed to get html");
    }
  };

  _onClickInlcudeHeader = () => {
    let downloadForm = this.state.downloadForm;
    downloadForm.includeHeader.value =
      !this.state.downloadForm.includeHeader.value;
    this.setState({
      downloadForm: downloadForm,
    });
  };

  _onClickRemoveEyeMailBranding = () => {
    let downloadForm = this.state.downloadForm;
    downloadForm.removeEyeMailBranding.value =
      !this.state.downloadForm.removeEyeMailBranding.value;
    this.setState({
      downloadForm: downloadForm,
    });
  };

  _onClickIncludeUnsubscribe = () => {
    let downloadForm = this.state.downloadForm;
    downloadForm.includeUnsubscribeLink.value =
      !this.state.downloadForm.includeUnsubscribeLink.value;
    this.setState({
      downloadForm: downloadForm,
    });
  };

  _onClickDownloadHtml = () => {
    console.log("html-exportSnipt",this.state.html);
    console.log("html-export",this.props.snippet);
       //  added

        let modifiedHtmlString ="";
        let btnFragment="";
   
//btn
      if(this.props.snippet.ctaButtonsHTML !=""){
        btnFragment = this.props.snippet.ctaButtonsHTML
      }

    //logo
    let log = ` <div className="logo ${this.props.snippet.logoImageAlignment}" style='${(this.props.snippet.logoImageAlignment=='right')?"text-align:right":(this.props.snippet.logoImageAlignment=='left')?"text-align:left":(this.props.snippet.logoImageAlignment=='center')?"text-align:center":""}' >
                <img
                  src=${this.props.snippet.logoImageUrl}
                  className=""
                  style="display:inline-block;width: ${this.props.snippet.logoImageWidth}px; margin-bottom:0px"
                   width= "${this.props.snippet.logoImageWidth}"
                />
              </div>`

      const fragmentImg = document.createDocumentFragment();
       if(this.props.snippet.coverImageUrl !=""){
        const coverImg = this.props.snippet.coverImageUrl
        
          
        let img =  `<div class="cover" >
                        <img
                          src=${this.props.snippet.coverImageUrl}
                          style="width:100%;height:auto;margin-bottom:0px"
                          width="600"
                          cm_dontimportimage=""
                        />`;
                     
              const parser = new DOMParser();
        const doc2 = parser.parseFromString(img, 'text/html');

        // Find the first div element
        const firstDiv2 = doc2.querySelector('div');

        let mg = (this.props.snippet.coverImagePlacement=="above")? (`margin-bottom: ${+(this.props.snippet.coverImageSpacing*8)}px`):(`margin-top: ${+(this.props.snippet.coverImageSpacing*8)}px`);

        firstDiv2.setAttribute('style', `display: flex;justify-content: center;width: 100%;margin: auto;align-items: center; ${mg}`);
         
              const divsToCopy2 = doc2.querySelectorAll('div');

                divsToCopy2.forEach(div => {
                  // Clone the div
                  const clonedDiv2 = div.cloneNode(true);
                  // Append the cloned div to the fragment
                  fragmentImg.appendChild(clonedDiv2);
              });  
      
      }
  

      let modifiedHtmlStringHTML ="";
       if(this.state.html !=""){
        const htmlString = this.state.html;
        const range = document.createRange();
        const videoHtml  = range.createContextualFragment(htmlString);
         // console.log("videoHtml",videoHtml);

         let html=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body></body></html>`;

        const parsers = new DOMParser();
        const doc1 = parsers.parseFromString(html, 'text/html');
        
        const head = doc1.querySelector('head');

                
         let hrf =[
                  "https://fonts.googleapis.com",
                   "https://fonts.gstatic.com" ,
                   "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900&family=Roboto:wght@100;300;400;500;700&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Ubuntu:wght@300;400;500;700&display=swap"    
                  ]
          
           hrf.forEach(function(currentValue, index) {
                      let link = document.createElement('link');
                            link.href=currentValue;
                            if(index==0||index==1){
                                    link.rel="preconnect";
                             }
                             if(index==1){
                                    link.crossorigin="anonymous";
                             }
                             if(index==2){
                                 link.rel="stylesheet"
                             }
                    head.appendChild(link);
                    });
         // console.log("html",doc1);

          let tableData =  `<table class="es-wrapper" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:auto;width:100%;max-width:600px;height:100%;background-repeat:repeat;background-position:center top;background-color:#fff" width="100%" cellspacing="0" cellpadding="0" align="center">
          <tbody><tr>
           <td style="padding:0;Margin:0" valign="top">       
           <table class="es-content" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important; width:100%" cellspacing="0" cellpadding="0" align="center">
              <tbody><tr>
               <td style="padding:0;Margin:0" align="center">
                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fff;" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                  <tbody>
                  <tr>
                   <td class="es-m-p0t" style="Margin:0;padding-top:30px;padding-bottom:0px;padding-left:0px;padding-right:0px" align="left">
                    <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px" width="100%" cellspacing="0" cellpadding="0">
                      <tbody><tr>
                       <td style="padding:0;Margin:0;" valign="top" align="center">
                        <table role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px" width="100%" cellspacing="0" cellpadding="0">
                          <tbody>
                          <tr>
                          <td style="padding:0;Margin:0;padding-bottom:16px" id="logo">
                                                                 
                          </td>
                         </tr>
                          <tr>
                          <td style="padding:0;Margin:0;padding-bottom:0px" id="abv">
                                                                 
                          </td>
                         </tr>
                         
                         <tr>
                          <td style="padding:0;Margin:0"  id="blw">
                            
                          </td>
                         </tr>
                           
                        </tbody></table></td>
                      </tr>
                    </tbody></table></td>
                  </tr>
                  
                  <tr>
                  <td style=" height: 20px;display: block;width:100%;">
                          
                  </td>
                  </tr>
                  <tr>
                   <td style="Margin:0;padding-top:0px;padding-bottom:40px;padding-left:0px;padding-right:0px" align="center">
                    <table class="es-left" style="width:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left" cellspacing="0" cellpadding="0" align="center">
                      <tbody><tr>
                       <td class="es-m-p20b" style="padding:0;Margin:0;width:520px" align="center">
                        <table role="presentation" style="width:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px" width="100%" cellspacing="0" cellpadding="0">
                          <tbody><tr>
                           <td style="padding:0;Margin:0" align="center" id="buttons">
                            
                         

                           </td>
                          </tr>
                        </tbody></table></td>
                      </tr>
                    </tbody></table><!--[if mso]></td><td style="width:20px"></td><td style="width:520px" valign="top"><![endif]-->
                    <!--[if mso]></td></tr></table><![endif]--></td>
                  </tr>
                </tbody></table></td>
              </tr>
            </tbody></table>
            </td>
          </tr>
        </tbody></table>`;
        const bod = doc1.querySelector('body');
        bod.insertAdjacentHTML('beforeend', tableData);
         
        if(this.props.snippet.logoImageUrl !=null){
        
            const tdLogoContainers = doc1.querySelector('#logo');  
            tdLogoContainers.insertAdjacentHTML('beforeend', log);   
         }
          
        
        if(this.props.snippet.video.gifUrl !=null){
          if(this.props.snippet.coverImagePlacement=='above'){ 
              if(this.props.snippet.coverImageUrl !=null){
                  const tdAbvContainers = doc1.querySelector('#abv');  
                  tdAbvContainers.appendChild(fragmentImg); 
              }
           
            const tdBlwContainers = doc1.querySelector('#blw');  
            tdBlwContainers.appendChild(videoHtml); 
        } }

          if(this.props.snippet.video.gifUrl !=null){
              if(this.props.snippet.coverImagePlacement=='below'){
                const tdAbvContainers = doc1.querySelector('#abv');  
                tdAbvContainers.appendChild(videoHtml); 
                  if(this.props.snippet.coverImageUrl !=null){
                    const tdBlwContainers = doc1.querySelector('#blw');  
                    tdBlwContainers.appendChild(fragmentImg); 
                  }
            }
         }
          
        const buttonsContainers = doc1.querySelector('#buttons');  
       // buttonsContainers.appendChild(fragment);
       buttonsContainers.insertAdjacentHTML('beforeend', btnFragment);   
        
       if(this.props.snippet.video.gifUrl !=null){
        const imgContainers = doc1.querySelector('#eyemailsource img');  
        imgContainers.setAttribute('width', '600');
        imgContainers.style.width = "100%";
       }
       
       let xdata = `<span style='mso-hide:all; display:none'><pre style='mso-hide:all; height: 0px width:0px; visibility: hidden; display: none; position: relative; top: -50px;z-index: -999;'>${this.props.snippet.video.url}</pre></span>`;
       bod.insertAdjacentHTML('beforeend',xdata);

       let xdata1 = `<span style='mso-hide:all; display:none'><span id="icon_url" style='mso-hide:all; height: 0px width:0px; visibility: hidden; display: none; position: relative; top: -55px;z-index: -999;'>${this.props.snippet.videoLogoImgUrl}</span></span>`;
       bod.insertAdjacentHTML('beforeend',xdata1); 

       let xdata2 = `<span style='mso-hide:all; display:none'><span id="video_site_url" style='mso-hide:all; height: 0px width:0px; visibility: hidden; display: none; position: relative; top: -60px;z-index: -999;'>${this.props.snippet.videoURLData}</span></span>`;
       bod.insertAdjacentHTML('beforeend',xdata2); 

          // console.log("testtss",doc1);
             
        // Convert the modified DOM object back to a string
         modifiedHtmlStringHTML = new XMLSerializer().serializeToString(doc1);

        // console.log("doc1",doc1);
      }
    
  
    const blob = new Blob([modifiedHtmlStringHTML], {
      type: "text/html;charset=utf-8;",
    });
  //  console.log("blob",blob);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.props.snippet.title + ".html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.props.onFinish();
  };

  _onClickPreviewHtml = () => {
    //window.open(this.props.previewUrl, "_blank");
     window.open(`${sitemap.routes.viewLiveSnippet.route}/${this.props.snippet.snippet}`,"_blank");

  };

  // Utils

  copyToClipboard = (name, text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }

    notification.info("Code copied to clipboard.");

    this.setState({
      [name]: true,
    });
    setTimeout(() => {
      this.setState({
        [name]: false,
      });
    }, 3000);
  };

  openLink = (link) => {
    if (!link.includes("?")) link += "?";
    link += `${
      this.state.downloadForm.includeHeader.value
        ? `&emailHeader=${
            this.state.downloadForm.headerText.value
          }&speakerIcon=${true}`
        : ""
    }${
      this.state.downloadForm.includeUnsubscribeLink.value ? "&unsub=true" : ""
    }&p=${this.state.downloadForm.platform.value}${
      this.state.downloadForm.removeEyeMailBranding.value ? "&brand=no" : ""
    }`;
    window.open(link, "_blank");
  };

  render() {
    return (
      <div className="cmp-export-snippet">
        <div className="ui grid">
          <div className="row">
            <div className="sixteen wide column">
              <div className="form">
                <form noValidate>
                  <Select {...this.state.downloadForm.platform} />

                  <p>
                    <strong>Video HTML</strong>
                  </p>
                  <div className="mt-3">
                    <div className="code" id="html">
                      <span
                        onClick={() =>
                          this.copyToClipboard("copied", this.state.html)
                        }
                        className="clickable"
                      >
                        {this.state.copied ? (
                          "Copied"
                        ) : (
                          <Icon iconType={"solid"} icon={"copy"} />
                        )}
                      </span>
                      {this.state.html}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p>
                      <strong>Download Options</strong>
                    </p>
                    <CheckBox {...this.state.downloadForm.includeHeader} />
                    {this.state.downloadForm.includeHeader.value ? (
                      <TextBox {...this.state.downloadForm.headerText} />
                    ) : null}
                    {/* <CheckBox
                      {...this.state.downloadForm.includeUnsubscribeLink}
                    /> */}
                    {/*<CheckBox {...this.state.downloadForm.removeEyeMailBranding} />*/}
                  </div>
                  <br />
                  <div className="ui center aligned grid">
                    <Button
                      className="brand"
                      onClick={this._onClickDownloadHtml}
                      inline={true}
                      category={"brand"}
                      title={"Download File (.html)"}
                      iconType={"Solid"}
                      icon={"file-code"}
                    />
                    {/*<Button*/}
                    {/*    className='button-secondary'*/}
                    {/*    onClick={this._onClickDownloadHtml}*/}
                    {/*    inline={true}*/}
                    {/*    title={'Download Text (.txt)'}*/}
                    {/*    iconType={'Solid'}*/}
                    {/*    icon={'file-code'}*/}
                    {/*/>*/}
                    <Button
                      onClick={this._onClickPreviewHtml}
                      inline={true}
                      title={"Preview"}
                      iconType={"Solid"}
                      icon={"external-link-alt"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ExportSnippet };

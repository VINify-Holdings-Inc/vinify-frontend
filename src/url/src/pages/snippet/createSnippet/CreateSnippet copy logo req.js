import React, { Component} from "react";
import { Modal, Progress, Transition ,Segment} from "semantic-ui-react";
import ProgressBar from "@ramonak/react-progress-bar";

import "./CreateSnippet.scss";

import { UploadVideo } from "../../../components/snippet";
import {
  Icon,
  TextBox,
  Button,
  ColorPicker,
  Select,
  CheckBox,
} from "../../../components/html";

import site from "../../../sitemap";
import notification from "../../../core/services/alert";
import formValidator from "../../../core/services/formValidator";
import { SnippetCreate } from "../../../actions/snippet";
import { EncodeVideoFile } from "../../../actions/file";
import { FileDropzone } from "../../../components/shared";
import { connect } from "react-redux";
import swal from "sweetalert2";

class CreateSnippet extends Component {
  //State

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    
  }
  isEnterpriseUser = this.props.user.tier == "enterprise";

  state = {
    snippetForm: {
      video: {
        value: null,
        url: "",
        label: "Video",
        errorMessage: "Video is required.",
        regex:
          /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi,
        required: true,
        helpText: "300mb max upload size",
        overlay: "none",
      },
      gif: {
        value: null,
        url: "",
        label: "GIF",
        required: false,
        regex:
          /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi,
        helpText: "Up to 14mb file size (.gif)",
      },
      title: {
        label: "Name Your EyeMail *",
        value: "",
        required: true,
        errorMessage: "Invalid Field",
        id: "title",
        placeholder: "Project or campaign name",
        type: "text",
        onChange: (event) => this._onChange(event),
        fluid: true,
        maxLength:240,
      },
      landingPageUrl: {
        label: "Landing Page URL",
        value: "",
        required: false,
        errorMessage: "Not a valid url",
        id: "landingPageUrl",
        placeholder: "Optionally set a custom landing page url",
        type: "text",
        onChange: (event) => this._onChange(event),
        fluid: true,
        dataContent:
          "Use this to set a custom landing page which the user is redirected to when they click on the video. If left empty the web page of EyeMail version is opened.",
        helpText: "Type the url with https",
        regex:
          /^(http|https):\/\/[a-z0-9]+(\.[a-z]+)+[A-Za-z0-9.$&+,:;=?@#|'<>.^*()%!-\{\}]+$/gi,
      },
      coverImage: {
        value: "",
        url: "",
        label: "Main Image/Graphic",
        placement: "below",
        spacing: "1",
        regex:
          /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi,
        helpText: "Up to 10mb file size (.png, .jpg, .jpeg)",
      },
      logoImage: {
        value: "",
        url: "",
        label: "Logo",
        alignment: "left",
        width: 120,
       // required: !this.isEnterpriseUser,
        regex:
          /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi,
        helpText: "Up to 10mb file size (.png, .jpg, .jpeg)",
      },
      width: {
        label: "Width (px)",
        value: 600,
        id: "width",
        placeholder: "600",
        type: "number",
        onChange: (event) => this._onChange(event),
        helpText: "Video width can be up to 800px.",
        minEqual: 600,
        maxEqual: 800,
      },
      ctaButtons: {
        validate: false,
        buttons: [],
      },
    },
    buttonForm: {
      buttonTitle: {
        label: "Button Text",
        value: "",
        errorMessage: "Invalid Field",
        id: "buttonTitle",
        placeholder: "Text",
        type: "text",
        fluid: true,
        onChange: (event) => this._onCTAButtonFieldChange(event),
        maxLength:16,
      },
      url: {
        label: "URL",
        value: "",
        errorMessage: "Not a valid url",
        id: "url",
        placeholder: "Type url with https://",
        type: "url",
        fluid: true,
        regex:
          /^(http|https):\/\/[a-z0-9]+(\.[a-z0-9]+)+[A-Za-z0-9.$&+,:;=?@#|'<>.^*()%!-\{\}]+$/gi,
        onChange: (event) => this._onCTAButtonURLChange(event),
      },
      buttonColor: {
        label: "Enter Button Color",
        value: "#444444",
        required: true,
        errorMessage: "Invalid Field",
        id: "buttonColor",
        placeholder: "Enter Button Color",
        type: "text",
        onChange: (event) => this._onCTAButtonFieldChange(event),
      },
      fontColor: {
        label: "Font Color",
        value: "#ffffff",
        required: true,
        errorMessage: "Invalid Field",
        id: "fontColor",
        placeholder: "Font Color",
        type: "text",
        onChange: (event) => this._onCTAButtonFieldChange(event),
      },
      radius: {
        label: "Rounded Border",
        value: 0,
        fluid: true,
        id: "radius",
        placeholder: "0",
        type: "number",
        onChange: (event) => this._onCTAButtonFieldChange(event),
        min: 0,
        max: 50,
      },
      bold: {
        value: true,
        validator: () => true,
        title: "Bold ",
        id: "bold",
        onChange: (event) => this._oncheckFontWeight(),
        tabIndex: "0",
      },
    },
    selectedButtonSize: { value: "small", text: "Small", padding: "10px" },
    selectedFontSize: { value: "small", text: "Small", fontSize: "1em" },
    backgroundColor: "#0ff",
    addingCTAButton: false,
    isURL: false,
    index: null,
    videoUploaded: false,
    videoEncoded: false,
    showLoadingModal: false,
    addVideoOverlay: false,
     progress: 0,
     playerHeight: 0,
     textLogoError:false,
     ErrorLogoWidthMsg:"",
     
  };

  getPlayerHeight() {
    if (this.videoRef.current) {
      const height = this.videoRef.current.clientHeight;
     // console.log("heightheight",height)
      this.setState({ playerHeight: height });
    }
  }

/*
  generateCTAButtonsHTML = () => {
    if (this.state.snippetForm.ctaButtons.buttons) {

      let snippet = ` 
            <!--[if mso]>
            ${this.state.snippetForm.ctaButtons.buttons
              .map(
                (button) =>
                    ` <a href="${button.url}" target="_blank" hidden>
                           <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${button.url}" 
                                         style="height:41px; v-text-anchor:middle; width:201px" arcsize="50%" stroke="f"  fillcolor="${button.backgroundColor}">
                             <w:anchorlock></w:anchorlock>
                             <center style='color:${button.fontColor}; font-family:Inter,-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size:${button.fontSize}; font-weight:${ this.state.buttonForm.bold.value ? 700 : 400}; line-height:15px;  mso-text-raise:1px'>${button.title}</center>
                           </v:roundrect></a>  &nbsp &nbsp `
                     ).join("")}
                         <![endif]--><!--[if !mso]> </td>
                          </tr>
                        </tbody></table></td>
                      </tr>
                    </tbody></table><!--[if mso]></td><td style="width:20px"></td><td style="width:520px" valign="top"><![endif]-->
                    <!--[if mso]></td></tr></table><![endif]-->


      <div style="display: block; margin-top:15px;width: 600px;margin: auto;max-width: 600px; font-family: Inter; margin:auto">
      
      <center style="mso-text-raise:1px; width: auto; display: inline-block; flex-direction: row; justify-content: center; align-items: center; margin: auto;">
      ${this.state.snippetForm.ctaButtons.buttons
        .map(
          (button) => `<span
          style="
          display: inline-block;
          background-color: ${button.backgroundColor};
          border-radius: ${button.radius}px;
          width:auto;
          margin: auto; 
           word-wrap: break-word;
          text-align: center;
          padding: ${button.padding};
        ">
          <a
            target="_blank"
            href="${button.url}"
            style="background-color: ${button.backgroundColor}; border-radius: ${button.radius}px;display: flex;
            align-items: center;padding-left:10px;padding-right:10px;color: ${
              button.fontColor
            }; text-decoration: none; font-weight: ${ this.state.buttonForm.bold.value ? "bold" : "normal"};
                font-size: ${button.fontSize} ; font-family: Inter; ">${button.title}
          </a>
        </span> &nbsp &nbsp `
        )
        .join("")}
      </center></div>`;
     // console.log("snippet",snippet,this.state.buttonForm.bold.value);
      return snippet;
    } else return "";
  };    */


  getTextWidth = (text, fontSizeEm) => {
    const baseFontSizePx = 16; 
  const fontSizePx = parseFloat(fontSizeEm) * baseFontSizePx;
  const font = `${fontSizePx}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
 
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width+35;
  }
  
  generateCTAButtonsHTML = () => {
    if (this.state.snippetForm.ctaButtons.buttons) {
      const buttonsHTML = this.state.snippetForm.ctaButtons.buttons
        .map((button) => {
          const fontSizePx = parseFloat(button.fontSize) * 16; 
        const textWidth = this.getTextWidth(button.title, button.fontSize);
       
          const buttonWidth = textWidth + 20; // padding-left and padding-right  ( parseFloat(button.padding.split(" ")[1]) * 2; )
         // console.log("width",buttonWidth,textWidth,button.fontSize,fontSizePx)
        const elementWidth = buttonWidth; 
        const elementHeight = 42; // (height:42px)
        const borderRadiusPercentageX = (button.radius / elementWidth) * 100;
        const borderRadiusPercentageY = (button.radius / elementHeight) * 100;
        const arcsize = (((borderRadiusPercentageX + borderRadiusPercentageY) / 2).toFixed(2)) - ((button.radius/2).toFixed(2)); // Average of the two percentages with adjsument

  
          return ` 
            <a href="${button.url}" target="_blank" hidden>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${button.url}" 
                style="height:42px; v-text-anchor:middle; width:${buttonWidth}px;" arcsize="${arcsize}%" stroke="f"  fillcolor="${button.backgroundColor}">
                <w:anchorlock></w:anchorlock>
                <center style='color:${button.fontColor}; font-family:Inter,-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size:${fontSizePx}px; font-weight:${ this.state.buttonForm.bold.value ? 700 : 400}; line-height:15px;  mso-text-raise:1px'>${button.title}</center>
              </v:roundrect></a> &nbsp &nbsp `;
        })
        .join("");
  
      const divHTML = this.state.snippetForm.ctaButtons.buttons
        .map((button) => {
            
          return `<span
            style="background-color: ${button.backgroundColor};border-radius: ${button.radius}px;width:auto;margin: auto;word-wrap: break-word;text-align: center;padding: ${button.padding};display: inline-block;margin-right:10px">
            <a
              target="_blank"
              href="${button.url}"
              style="background-color: ${button.backgroundColor}; border-radius: ${button.radius}px; display:flex;align-items:center; padding-left:0px; padding-right:0px; color: ${button.fontColor}; text-decoration: none; font-weight: ${button.bold ? "bold" : "normal"}; font-size: ${button.fontSize}; font-family: Inter;" >${button.title}</a>
          </span> `;
        })
        .join("");
  
      let snippet = ` 
      <!--[if mso]>
      ${buttonsHTML}
      <![endif]--><!--[if !mso]> </td>
        </tr>
      </tbody></table></td>
      </tr>
    </tbody></table><!--[if mso]></td><td style="width:20px"></td><td style="width:520px" valign="top"><![endif]-->
    <!--[if mso]></td></tr></table><![endif]-->
  
    <div style="display: block; margin-top:15px; width: 100%; margin: auto; max-width: 600px; font-family: Inter; margin: auto;">
      <center style="mso-text-raise:1px; width: auto; display: inline-block; flex-direction: row; justify-content: center; align-items: center; margin: auto;">
        ${divHTML}
      </center>
    </div>`;
  
      return snippet;
    } else return "";
  };
  


  _onChange = (event) => {
    let snippetForm = this.state.snippetForm;
    snippetForm[event.target.name].value = event.target.value;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onCTAButtonURLChange = (event) => {
    let oldState = this.state;
    oldState.buttonForm.url.value = event.target.value;
    var re = new RegExp(oldState.buttonForm.url.regex);
    let url = oldState.buttonForm.url.value;
    var match = re.test(url);
    oldState.isURL = match;
    this.setState({ ...oldState });
  };

  _onCTAButtonFieldChange = (event) => {
    let buttonForm = this.state.buttonForm;
    buttonForm[event.target.name].value = event.target.value;
    this.setState({
      buttonForm: buttonForm,
    });
  };

  _onClickCreateSnippet = (ev) => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.snippetForm);
   // console.log(isValid, form);
    this.setState({ progress: 0 });
    this.setState({
      snippetForm: form,
    });
    if (isValid) {
      if (this.isEnterpriseUser) {
       // this.createSnippet();

       this.encodeVideo(this.state.snippetForm.video.value);
        this.setState({
          showLoadingModal: true,
        });
      } else {
        this.encodeVideo(this.state.snippetForm.video.value);
        this.setState({
          showLoadingModal: true,
        });
      }
    } else {
    }
  };

  _onChangeVideo = (files) => {
    //console.log("files[0]?.type",files[0])
    if(files[0]?.type=='video/mp4'|| files[0]?.type=='video/quicktime') {
      // preview file is loading more than 300mb
        if(files[0].size < 1048576 * 300){
            let snippetForm = this.state.snippetForm;
            snippetForm.video.url = URL.createObjectURL(files[0]);
            snippetForm.video.helpText="";
            
            this.setState({
              snippetForm: snippetForm,
            });
            setTimeout(() => {
              //console.log('Delayed action executed!');
              this.getPlayerHeight();
            }, 2000);
         }
   }else{
       //   console.log("please select mp4");
      let snippetForm = this.state.snippetForm;
      snippetForm.video.helpText="Please upload .mp4 or .mov file only";
      this.setState({...snippetForm});

   }
  };

  _onUploadVideo = (videoUploadRes) => {
    let snippetForm = this.state.snippetForm;
    const { fileId, url } = videoUploadRes.body;
    snippetForm.video.value = fileId;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onVideoUploadFail = () => {
    let snippetForm = this.state.snippetForm;
    snippetForm.video.value = null;
    snippetForm.video.url = null;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onClickDiscardVideo = () => {
    let snippetForm = this.state.snippetForm;
    snippetForm.video.value = null;
    snippetForm.video.url = null;
    this.setState({
      snippetForm: snippetForm,
      videoUploaded: false,
      videoEncoded: false,
    });
    // TODO: delete video assets and files
  };

  _onUploadGIF = (gifUploadRes) => {
    let snippetForm = this.state.snippetForm;
    const { fileId, url } = gifUploadRes.body;
    snippetForm.gif.value = fileId;
    snippetForm.gif.url = url;
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  _onGIFUploadFail = () => {
    let snippetForm = this.state.snippetForm;
    snippetForm.gif.value = "";
    snippetForm.gif.url = "";
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  _onUploadCoverImage = (imageUploadRes) => {
    let snippetForm = this.state.snippetForm;
    const { fileId, url } = imageUploadRes.body;
    snippetForm.coverImage.value = fileId;
    snippetForm.coverImage.url = url;
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  _onCoverImageUploadFail = () => {
    let snippetForm = this.state.snippetForm;
    snippetForm.coverImage.value = "";
    snippetForm.coverImage.url = "";
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  _onUploadLogoImage = (imageUploadRes) => {
    let snippetForm = this.state.snippetForm;
    const { fileId, url } = imageUploadRes.body;
    snippetForm.logoImage.value = fileId;
    snippetForm.logoImage.url = url;
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  _onLogoImageUploadFail = () => {
    let snippetForm = this.state.snippetForm;
    snippetForm.logoImage.value = "";
    snippetForm.logoImage.url = "";
    this.setState({
      snippetForm: snippetForm,
    });
    return true;
  };

  //Utils

  encodeVideo = async (fileId) => {
    try {
      let res = await EncodeVideoFile(fileId, {
        overlay: this.state.snippetForm.video.overlay,
      });
     // console.log("result",res);
      if (res.result) {
        await this.createSnippet();
      } else {
        throw 0;
      }
    } catch (error) {
      // notification.error(
      //   "Unable to process video and update EyeMail, please try again",
      //   "saveFailed"
      // ); 
      swal("Unable to process video and Create EyeMail, please try again");
     
      this.setState({
        showLoadingModal: false,
      });
    }
  };

  createSnippet = async () => {
    let snippet = {
      title: this.state.snippetForm.title.value,
      videoId: this.state.snippetForm.video.value,
      gifId: this.state.snippetForm.gif.value,
      videoOverlay: this.state.snippetForm.video.overlay,
      coverImageId: this.state.snippetForm.coverImage.value,
      coverImagePlacement: this.state.snippetForm.coverImage.placement,
      coverImageSpacing: this.state.snippetForm.coverImage.spacing,
      logoImageId: this.state.snippetForm.logoImage.value,
      logoImageAlignment: this.state.snippetForm.logoImage.alignment,
      logoImageWidth: +this.state.snippetForm.logoImage.width,
      landingPageUrl: this.state.snippetForm.landingPageUrl.value,
      width: parseInt(this.state.snippetForm.width.value || 600),
      ctaButtonsJSON: JSON.stringify(this.state.snippetForm.ctaButtons.buttons),
      ctaButtonsHTML: this.generateCTAButtonsHTML(),
      addVideoOverlay:this.state.addVideoOverlay,
    };
    //console.log("snippet",snippet);
    let response = await SnippetCreate(snippet);
    if (response.result) {
      window.location.href = `${site.routes.viewSnippet.route}/${response.body}`;
    } else {
      notification.error(response.message, "snippetCreateFailed");
    }
  };

  _onAddCTAButton = () => {
    let oldState = { ...this.state };

    oldState.snippetForm.ctaButtons.buttons.push({
      title: this.state.buttonForm.buttonTitle.value,
      backgroundColor: this.state.buttonForm.buttonColor.value,
      fontColor: this.state.buttonForm.fontColor.value,
      url: oldState.buttonForm.url.value,
      padding: this.state.selectedButtonSize.padding,
      btnSize: this.state.selectedButtonSize.value,
      fontSize: this.state.selectedFontSize.fontSize,
      fontValue: this.state.selectedFontSize.value,
      radius: oldState.buttonForm.radius.value,
      bold: oldState.buttonForm.bold.value,
    });
    oldState.buttonForm.buttonTitle.value = "";
    oldState.buttonForm.buttonColor.value = "#EFEFEF";
    oldState.buttonForm.fontColor.value = "#000000";
    oldState.buttonForm.url.value = "";
    oldState.selectedButtonSize = {
      value: "small",
      text: "Small",
      padding: "10px",
    };
    oldState.selectedFontSize = {
      value: "small",
      text: "Small",
      fontSize: "1em",
    };
   // oldState.buttonForm.bold.value = false;
  //  oldState.buttonForm.radius.value = 0;
    oldState.addingCTAButton = !this.state.addingCTAButton;
    this.setState({ ...oldState });
  };

  _onToggleCTAButtonForm = () => {
      let oldState = { ...this.state };
      oldState.selectedButtonSize = {
        value: "small",
        text: "Small",
        padding: "10px",
      };
      oldState.selectedFontSize = {
        value: "small",
        text: "Small",
        fontSize: "1em",
      };
      oldState.buttonForm.buttonTitle.value = "";
      oldState.buttonForm.buttonColor.value = "#444444";
      oldState.buttonForm.fontColor.value = "#ffffff";
      oldState.buttonForm.url.value = "";
      oldState.buttonForm.radius.value = 0;
    if (this.state.snippetForm.ctaButtons.buttons.length < 4) {
      oldState.addingCTAButton = !this.state.addingCTAButton;
    }
    oldState.index = null;
    this.setState({ ...oldState });
   
  };

  
  clearCallInActionData = ()=>{
    let oldState = { ...this.state };
      oldState.selectedButtonSize = {
      value: "small",
      text: "Small",
      padding: "10px",
    };
    oldState.selectedFontSize = {
      value: "small",
      text: "Small",
      fontSize: "1em",
    };
    oldState.buttonForm.buttonTitle.value = "";
    oldState.buttonForm.buttonColor.value = "#444444";
    oldState.buttonForm.fontColor.value = "#ffffff";
    oldState.buttonForm.url.value = "";
    oldState.buttonForm.radius.value = 0;
    
    this.setState({ ...oldState });
  }

  _onRemoveCTAButton = (ind) => {
    let oldState = { ...this.state };
    oldState.snippetForm.ctaButtons.buttons.splice(ind, 1);
    oldState.selectedButtonSize = {
      value: "small",
      text: "Small",
      padding: "10px",
    };
    oldState.selectedFontSize = {
      value: "small",
      text: "Small",
      fontSize: "1em",
    };
    oldState.buttonForm.buttonTitle.value = "";
    oldState.buttonForm.buttonColor.value = "#444444";
    oldState.buttonForm.fontColor.value = "#ffffff";
    oldState.buttonForm.url.value = "";
    oldState.buttonForm.radius.value = 0;
   
    this.setState({ ...oldState });
  };


  _onEditCTAButton = (ind) => {
    let oldState = { ...this.state };
    oldState.addingCTAButton = true;
    oldState.index = ind;
    let currentButton = oldState.snippetForm.ctaButtons.buttons[ind];
    oldState.buttonForm.buttonTitle.value = currentButton.title;
    oldState.buttonForm.buttonColor.value = currentButton.backgroundColor;
    oldState.buttonForm.fontColor.value = currentButton.fontColor;
    oldState.buttonForm.url.value = currentButton.url;
    oldState.buttonForm.radius.value = currentButton.radius;
    oldState.buttonForm.bold.value = currentButton.bold;
    this.state.selectedFontSize.fontSize = currentButton.fontSize;
    this.state.selectedFontSize.value = currentButton.fontValue;
    this.state.selectedButtonSize.padding = currentButton.padding;
    this.state.selectedButtonSize.value = currentButton.btnSize;
    this.setState({ ...oldState });
  };

  _onSaveCTAButton = () => {
    let oldState = { ...this.state };

    let newTemplate = oldState.snippetForm.ctaButtons.buttons;
    var re = new RegExp("^(http|https)://", "i");
    let url = oldState.buttonForm.url.value;
    var match = re.test(url);
    if (match == false) url = `https://${url}`;

    newTemplate.splice(oldState.index, 1, {
      title: this.state.buttonForm.buttonTitle.value,
      backgroundColor: this.state.buttonForm.buttonColor.value,
      fontColor: this.state.buttonForm.fontColor.value,
      url: url,
      radius: this.state.buttonForm.radius.value,
      padding: this.state.selectedButtonSize.padding,
      fontSize: this.state.selectedFontSize.fontSize,
      bold: this.state.buttonForm.bold.value,
      fontValue: this.state.selectedFontSize.value,
      btnSize: this.state.selectedButtonSize.value,
    });
    oldState.buttonForm.buttonTitle.value = "";
    oldState.buttonForm.buttonColor.value = "#444444";
    oldState.buttonForm.fontColor.value = "#ffffff";
    oldState.buttonForm.url.value = "";
    oldState.buttonForm.radius.value = 0;
    oldState.addingCTAButton = !this.state.addingCTAButton;
    oldState.selectedButtonSize = {
      value: "small",
      text: "Small",
      padding: "10px",
    };
    oldState.selectedFontSize = {
      value: "small",
      text: "Small",
      fontSize: "1em",
    };
    oldState.index = null;

    this.setState({ ...oldState });
  };

  _onSelectColor = (color, title) => {
   // console.log("co",color, title);
    const oldState = { ...this.state };
    oldState.buttonForm[title].value = color;
    this.setState(oldState);
  };
  _onSelectButtonSizeChange = (size) => {
    const oldState = { ...this.state };
    let padding;
    switch (size.target.value) {
      case "medium":
        padding = "15px 10px";
        break;
      case "large":
        padding = "20px 10px";
        break;
      default:
        padding = "10px";
        break;
    }
    oldState.selectedButtonSize = {
      name: size.target.name,
      value: size.target.value,
      padding:padding,
    };
    this.setState({ ...oldState });
  };
  _onSelectFontSizeChange = (size) => {
    const oldState = { ...this.state };
    let fontSize;
    switch (size.target.value) {
      case "medium":
        fontSize = "1.2em";
        break;
      case "large":
        fontSize = "1.4em";
        break;
      default:
        fontSize = "1em";
        break;
    }
    oldState.selectedFontSize = {
      name: size.target.name,
      value: size.target.value,
      fontSize:fontSize,
    };
    this.setState({ ...oldState });
  };
  _onClickButtonFontBold = () => {
    const oldState = { ...this.state };
    oldState.bold = !this.state.bold;
    this.setState({ ...oldState });
  };

/*  _onClickRememberMe = () => {
    const oldState = { ...this.state };
    oldState.buttonForm.bold.value = !this.state.buttonForm.bold.value;
    this.setState({ ...oldState });
  };   */

  _oncheckFontWeight = () => {  
   // console.log("here",!this.state.buttonForm.bold.value)
    const oldState = { ...this.state };
    oldState.buttonForm.bold.value = !this.state.buttonForm.bold.value;
    this.setState({ ...oldState });
   // console.log("here",this.state);

  };

  _onChangeAddVideoOverlay = (event) => {
    const snippetForm = this.state.snippetForm;
    snippetForm.video.overlay = event.target.checked ? "black" : "none";

    this.setState({
      addVideoOverlay: event.target.checked,
      snippetForm: snippetForm,
    });
   // console.log("event.target.checked",event.target.checked);
  };

  _onChangeVideoOverlay = (event) => {
    const snippetForm = this.state.snippetForm;
    snippetForm.video.overlay = event.target.value;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onToggleCoverPlacement = () => {
    const snippetForm = this.state.snippetForm;
    snippetForm.coverImage.placement =
      snippetForm.coverImage.placement == "above" ? "below" : "above";
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onChangeCoverSpacing = (spacing) => {
    const snippetForm = this.state.snippetForm;
    snippetForm.coverImage.spacing = spacing.target.value;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onChangeLogoAlignment = (alignment) => {
    const snippetForm = this.state.snippetForm;
    snippetForm.logoImage.alignment = alignment;
    this.setState({
      snippetForm: snippetForm,
    });
  };

  _onChangeLogoWidth = (width) => {
    if( width.nativeEvent.target.value <=  600){
        const snippetForm = this.state.snippetForm;
            snippetForm.logoImage.width = width.nativeEvent.target.value;
            this.setState({
              snippetForm: snippetForm,
              textLogoError:false,
              ErrorLogoWidthMsg:""
            });
    }else{
     
       this.setState({
       
        textLogoError:true,
        ErrorLogoWidthMsg:"Logo size less than 600px"
      });
    }
   
  };

  
   // Function to increment progress value
  incrementProgress = () => {
    this.setState((prevState) => {
      
      if (prevState.progress === 99) {
        return { progress: 99 };
      }
      // Otherwise, increment progress by 1
      return { progress: prevState.progress + 1 };
    });
  };

  // Start the interval when component mounts
  componentDidMount() {
    this.interval = setInterval(this.incrementProgress, 550); // Increment progress every 350 milliseconds
    //console.log("test",this.state);
  }

  // Clear the interval when component unmounts
  componentWillUnmount() {
    clearInterval(this.interval);
  } 

 componentDidUpdate(prevProps, prevState) {
    // Runs after the component updates
   // console.log('Component updated',this.state.snippetForm.ctaButtons.buttons.length);
    // console.log("button",this.state.snippetForm.ctaButtons.buttons);
  }







  render() {
    return (
      <div className="page-create-snippet">
        <header>
          <h1 className="text-2xl font-bold">Create EyeMail</h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-8">
          <div className="lg:w-6/12 xl:w-5/12">
            {/* Title */}
            <div className="mt-5">
              <TextBox
                className="w-full md:w-full"
                {...this.state.snippetForm.title}
                tabIndex={0}
              />
            </div>

            {/* Logo */}
            {!this.isEnterpriseUser && (
            <div className="mt-5">
              <label className="font-bold mb-2 inline-block">Logo </label>
              <FileDropzone
                type="image"
                fileTypes=".png,.jpg,.jpeg"
                onSuccess={this._onUploadLogoImage}
                onFailure={this._onLogoImageUploadFail}
                onBeforeFileRemove={this._onLogoImageUploadFail}
              />
              {this.state.snippetForm.logoImage.value ? (
                <>
                  <div className="flex justify-between items-center mt-5">
                    <label className="flex-1">Alignment</label>
                    <div className="flex gap-x-2">
                      <Button
                        className={
                          this.state.snippetForm.logoImage.alignment === "left"
                            ? "brand p-2"
                            : "p-2"
                        }
                        inline={true}
                        size={"small"}
                        icon="align-left"
                        style={{ marginRight: "0px" }}
                        title="Left"
                        onClick={() => this._onChangeLogoAlignment("left")}
                      />
                      <Button
                        className={
                          this.state.snippetForm.logoImage.alignment ===
                          "center"
                            ? "brand p-2"
                            : "p-2"
                        }
                        inline={true}
                        size={"small"}
                        icon="align-center"
                        style={{ marginRight: "0px" }}
                        title="Center"
                        onClick={() => this._onChangeLogoAlignment("center")}
                      />
                      <Button
                        className={
                          this.state.snippetForm.logoImage.alignment === "right"
                            ? "brand p-2"
                            : "p-2"
                        }
                        inline={true}
                        size={"small"}
                        icon="align-right"
                        style={{ marginRight: "0px" }}
                        title="Right"
                        onClick={() => this._onChangeLogoAlignment("right")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <label className="flex-1">Width</label>
                    <div>
                      <TextBox
                        value={this.state.snippetForm.logoImage.width}
                        id={"logoWidth"}
                        className="md:w-full"
                        type={"number"}
                        helpText={"Logo width can be up to 600px."}
                        minEqual={40}
                        maxEqual={600}
                        onChange={this._onChangeLogoWidth}
                        style={{ marginBottom: 0 }}
                        error={this.state.textLogoError}
                        errorComputedMessage={this.state.ErrorLogoWidthMsg}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div> 
            )}

            {/* Video */}
            <div className="mt-5" >
              <label className="font-bold mb-2 inline-block">
                Upload Your Video *
              </label>
              <UploadVideo
                {...this.state.snippetForm.video}
                onChange={this._onChangeVideo}
                onSuccess={this._onUploadVideo}
                onFailure={this._onVideoUploadFail}
              //  queryOptions={{ directUpload: this.isEnterpriseUser }}
                queryOptions={{ directUpload: false }}
                onBeforeFileRemove={this._onVideoUploadFail}
               
              />

           {/*   {!this.isEnterpriseUser && this.state.snippetForm.video.url && (    */ }
              { this.state.snippetForm.video.url && (   
                <div>
                  <div className="mt-3 relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        onChange={this._onChangeAddVideoOverlay}
                        id="mute-icon"
                        type="checkbox"
                        tabIndex={0}
                        className="checkbox focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <div className="ml-2">
                      <label
                        htmlFor="mute-icon"
                        className="font-bold text-gray-700 cursor-pointer"
                      >
                        Add mute icon
                      </label>
                    </div>
                  </div>

                  {this.state.addVideoOverlay && (
                    <div className="mt-3 flex items-center gap-x-2">
                      <label className="text-base text-gray-700">
                        Choose color
                      </label>

                      <div
                        onChange={this._onChangeVideoOverlay}
                        className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4"
                      >
                        <div className="flex items-center" >
                          <input
                            id="black"
                            name="mute-icon-color"
                            type="radio"
                            value="black"
                            defaultChecked
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                          />
                          <label
                            htmlFor="black"
                            className="ml-2 block text-gray-700 font-bold cursor-pointer flex items-center gap-x-2"
                          >
                            {/* <img
                              src={require(`./../../../content/img/gif-overlay-black.png`)}
                              className="w-6"
                              alt=""
                            /> */}
                            <span>Black</span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="white"
                            name="mute-icon-color"
                            type="radio"
                            value="white"
                            
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                          />
                          <label
                            htmlFor="white"
                            className="ml-2 block text-gray-700 font-bold cursor-pointer flex items-center gap-x-2"
                          >
                            {/* <img
                              src={require(`./../../../content/img/gif-overlay-white.png`)}
                              style={{ padding: "2px" }}
                              className="w-6 bg-gray-800"
                              alt=""
                            /> */}
                            <span>White</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* {this.state.videoUploaded ? (
                this.state.videoEncoded ? (
                  <>
                    <div>
                      <video
                        playsInline
                        controls
                        style={{ width: '100%', maxWidth: "800px" }}
                        poster={
                          this.state.contextVideo.thumbnailUrl ||
                          require(`../../../content/img/default-video-thumbnail.png`)
                        }
                        src={this.state.contextVideo.videoUrl}
                      />
                    </div>
                    <div>
                      <Button
                        inline={true}
                        transparent={true}
                        iconType={"solid"}
                        icon={"trash-alt"}
                        title="Discard"
                        className="p-0"
                        onClick={this._onClickDiscardVideo}
                      />
                    </div>
                  </>
                ) : (
                  <p>
                    <Icon
                      className="icon-processing-video"
                      icon="sync"
                      spin={true}
                      size="2"
                    />
                    Optimizing your video, please feel free to design your EyeMail meanwhile ...
                  </p>
                )
              ) : (
                <UploadVideo
                  {...this.state.snippetForm.video}
                  onSuccess={this._onUploadVideo}
                  onFailure={this._onVideoUploadFail}
                />
              )} */}

            <div className="form">
              <form noValidate onSubmit={this._onClickCreateSnippet}>
                {/* {this.isEnterpriseUser && (
                  <div className="mt-4">
                    <label className="font-bold mb-2 inline-block">
                      Upload Your GIF
                    </label>
                    <FileDropzone
                      type="image"
                      fileTypes=".gif"
                      onSuccess={this._onUploadGIF}
                      onFailure={this._onGIFUploadFail}
                      onBeforeFileRemove={this._onGIFUploadFail}
                    />
                  </div>
                )} */}

                {/* Creative */}
                {!this.isEnterpriseUser && (
                <div className="mt-5">
                  <label className="font-bold mb-2 inline-block">
                    Creative/Graphic
                  </label>
                  <FileDropzone
                    type="image-img"
                    fileTypes=".png,.jpg,.jpeg,.gif"
                    onSuccess={this._onUploadCoverImage}
                    onFailure={this._onCoverImageUploadFail}
                    onBeforeFileRemove={this._onCoverImageUploadFail}
                  />
                  {this.state.snippetForm.coverImage.value ? (
                    <>
                      <div className="flex justify-between items-center mt-3">
                        <label>Placement with video</label>
                        <div className="flex gap-x-3">
                          <Button
                            className={
                              this.state.snippetForm.coverImage.placement ===
                              "above"
                                ? "brand p-2"
                                : "p-2"
                            }
                            inline={true}
                            size={"small"}
                            icon="arrow-up"
                            style={{ marginRight: "0px" }}
                            title="Above"
                            onClick={this._onToggleCoverPlacement}
                          />
                          <Button
                            className={
                              this.state.snippetForm.coverImage.placement ===
                              "below"
                                ? "brand p-2"
                                : "p-2"
                            }
                            inline={true}
                            size={"small"}
                            icon="arrow-down"
                            style={{ marginRight: "0px" }}
                            title="Below"
                            onClick={this._onToggleCoverPlacement}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <label>Spacing with video</label>
                        <Select
                          options={[
                            { value: "0", text: "None" },
                            { value: "1", text: "Small" },
                            { value: "2", text: "Medium" },
                            { value: "3", text: "Large" },
                          ]}
                          value={this.state.snippetForm.coverImage.spacing}
                          fluid={true}
                          selection={true}
                          multiple={false}
                          id="coverImageSpacing"
                          name="coverImageSpacing"
                          placeholder="Space between video and main image"
                          onChange={this._onChangeCoverSpacing}
                          style={{ marginBottom: 0, minWidth: 140 }}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                )}

                {/* Landing Page */}
                <div className="mt-5">
                  <TextBox
                    className="w-full md:w-full"
                    {...this.state.snippetForm.landingPageUrl}
                  />
                </div>

                {/*<div className='mt-5'>*/}
                {/*    <TextBox {...this.state.snippetForm.width} />*/}
                {/*</div>*/}

                {/* CTA Buttons */}
                {!this.isEnterpriseUser && (   

                <div className="form-group mt-5">
                  <div className="font-bold block mb-2">
                    Call-to-Action Buttons
                  </div>

                  {!this.state.addingCTAButton && (
                    <div
                      style={{
                        backgroundColor: "White",
                        border: "2px solid #eee",
                        padding: "7px",
                        borderRadius: "6px",
                        marginBottom: "5px",
                      }}
                    >
                      {this.state.snippetForm.ctaButtons.buttons.map(
                        (button, ind) => {
                          return (
                            <span key={ind}>
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent:"space-between",
                                 /* borderRadius: "6px",
                                  backgroundColor: button.backgroundColor, */
                                  verticalAlign: "top",
                                  marginRight: "12px",
                                  marginBottom: "8px",
                                }}
                              >
                                <a
                                  style={{
                                    color: button.fontColor,
                                    padding: "11px 12px",
                                    /**added */
                                    marginRight: "3px",
                                    borderRadius: "6px", 
                                    backgroundColor: button.backgroundColor,
                                     /**added */
                                  }}
                                  href={button.url}
                                  target="_blank"
                                >
                                  {button.title}
                                </a>
                                 <div className="resp-btn">
                                <Button
                                  inline={true}
                                  size={"small"}
                                  className="brand"
                                  icon="trash"
                                  style={{ marginRight: "3px" }}
                                  onClick={() => this._onRemoveCTAButton(ind)}
                                />
                                <Button
                                  inline={true}
                                  size={"small"}
                                  className="brand"
                                  icon="pencil-alt"
                                  style={{ marginRight: "0px" }}
                                  onClick={() => this._onEditCTAButton(ind)}
                                />
                                </div>
                              </span>
                            </span>
                          );
                        }
                      )}
                      <Button
                        inline={true}
                        className="border border-primary mt-3"
                        size={"small"}
                        icon="plus"
                        onClick={this._onToggleCTAButtonForm}
                        style={{display:(this.state.snippetForm.ctaButtons.buttons.length>=4)?"none":"block"}}  
                      />
                    </div>
                  )}

                  {this.state.addingCTAButton && (
                    <div className="cta-button-form bg-light-rose border border-gray-200 pt-2 px-4 md:px-8">
                      <div className="flex justify-between gap-x-6 pt-3">
                        <TextBox
                          className="w-full md:w-full bg-white border-gray-300"
                          style={{ background: "#fff" }}
                          {...this.state.buttonForm.buttonTitle}
                        />

                        <TextBox
                          className="w-full md:w-full bg-white border-gray-300"
                          style={{ background: "#fff" }}
                          {...this.state.buttonForm.url}
                        />
                      
                      </div>
                     
                      <div className=""> 
                        {!this.state.isURL &&
                          this.state.buttonForm.url.value && (
                            <p className="urlVal">Not a valid url.</p>
                          )}
                      </div>  


                      <div className="border-b border-gray-200 py-2 mt-3">
                        <p className="text-sm text-gray-400">STYLE</p>
                      </div>

                      <div className="flex justify-between gap-x-6 pt-2 mt-3">
                        <div className="w-full" >
                          <strong>Background color</strong>
                          <ColorPicker 
                            title="buttonColor"
                            getColor={this._onSelectColor}
                            color={this.state.buttonForm.buttonColor.value}
                          />
                        </div>

                        <div className="w-full">
                          <strong>Text color</strong>
                          <ColorPicker
                            title="fontColor"
                            getColor={this._onSelectColor}
                            color={this.state.buttonForm.fontColor.value}
                          />
                        </div>

                        <div className="w-full">
                          <TextBox
                            className="w-full md:w-full bg-white border-gray-300"
                            style={{ background: "#fff" }}
                            {...this.state.buttonForm.radius}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between gap-x-6 pt-2 mt-3">
                        <Select
                          style={{ background: "#fff" }}
                          options={[
                            { value: "small", text: "Small" },
                            { value: "medium", text: "Medium" },
                            { value: "large", text: "Large" },
                          ]}
                          value={this.state.selectedButtonSize.value}
                          label="Select Button Size"
                          isFullWidth={true}
                          fluid={true}
                          selection={true}
                          multiple={false}
                          id="buttonSize"
                          name="buttonSize"
                          placeholder="Select Button Size"
                          onChange={this._onSelectButtonSizeChange}
                        />

                        <Select
                          style={{ background: "#fff" }}
                          options={[
                            { value: "small", text: "Small" },
                            { value: "medium", text: "Medium" },
                            { value: "large", text: "Large" },
                          ]}
                          value={this.state.selectedFontSize.value}
                          label="Select Font Size"
                          fluid={true}
                          isFullWidth={true}
                          selection={true}
                          multiple={false}
                          id="fontSize"
                          name="fontSize"
                          placeholder="Select Font Size"
                          onChange={this._onSelectFontSizeChange}
                        />

                        <div className="w-full">
                          <strong className="inline-block mb-2">
                            Text Weight
                          </strong>
                          <CheckBox {...this.state.buttonForm.bold} onChange={this._oncheckFontWeight} />
                        </div>
                      </div>

                      <div className="border-b border-gray-200 py-2 mt-3">
                        <p className="text-sm text-gray-400">PREVIEW BUTTON</p>
                      </div>

                      <div className="w-full flex justify-center border-b border-gray-200">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                            padding: "15px",
                            minWidth: "115px",
                          }}
                        >
                          <span
                            style={{
                              textAlign:"center",
                              display: "block",
                              backgroundColor:
                                this.state.buttonForm.buttonColor.value,
                              color: this.state.buttonForm.fontColor.value,
                              padding: `${this.state.selectedButtonSize.padding}`,
                              borderRadius: `${this.state.buttonForm.radius.value}px`,
                              outline: "none",
                              borderStyle: "solid",
                              borderColor:
                                this.state.buttonForm.buttonColor.value,
                              fontSize: this.state.selectedFontSize.fontSize,
                              fontWeight: this.state.buttonForm.bold.value
                                ? "bold"
                                : "",
                            }}
                          >
                            {this.state.buttonForm.buttonTitle.value ||
                              "Sample Button"}
                          </span>
                        </div>
                      </div>

                      <div className="pb-6">
                        <br />

                        {/*      
                        {!this.state.isURL &&
                          this.state.buttonForm.url.value && (
                            <p>Not a valid url.</p>
                          )} 
                           */}

                        {this.state.index === null ? (
                          <>
                            <Button
                              category="primary"
                              size={"small"}
                              title="Add"
                              onClick={this._onAddCTAButton}
                              inline={true}
                              disabled={
                                !this.state.buttonForm.buttonTitle.value ||
                                !this.state.buttonForm.buttonColor.value ||
                                !this.state.buttonForm.fontColor.value ||
                                !this.state.isURL
                              }
                             
                            />
                            {this.state.addingCTAButton && (
                              <Button
                                transparent="transparent"
                                size={"small"}
                                title={"Close"}
                                inline={true}
                                onClick={this._onToggleCTAButtonForm}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              category="primary"
                              size={"small"}
                              title="Update"
                              onClick={this._onSaveCTAButton}
                              inline={true}
                              disabled={
                                !this.state.buttonForm.buttonTitle.value ||
                                !this.state.buttonForm.buttonColor.value ||
                                !this.state.buttonForm.fontColor.value ||
                                !this.state.isURL
                              }
                            />
                            {this.state.addingCTAButton && (
                              <Button
                                transparent="transparent"
                                size={"small"}
                                title={"Close"}
                                inline={true}
                                onClick={this._onToggleCTAButtonForm}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
   
      {!this.isEnterpriseUser ? (
                <div className="mt-8">
                    <Button
                    className={(this.state.snippetForm.video.value==null || this.state.snippetForm.title.value==""|| this.state.snippetForm.logoImage.value=="")?"brand btnGrey":"brand "}
                    category="primary"
                    type="submit"
                    size={"small"}
                    title="Create EyeMail"
                    //disabled={!this.state.snippetForm.video.value}
                    disabled={(this.state.snippetForm.video.value==null || this.state.snippetForm.title=="" ||this.state.snippetForm.logoImage.value=="")?true:false}
                  />
                  {this.state.videoUploaded && !this.state.videoEncoded && (
                    <small>
                      Please wait while we finish processing your video
                    </small>
                  )}
                </div>):(
                  <div className="mt-8">
                  <Button
                  className={(this.state.snippetForm.video.value==null || this.state.snippetForm.title.value=="")?"brand btnGrey":"brand "}
                  category="primary"
                  type="submit"
                  size={"small"}
                  title="Create EyeMail"
                  //disabled={!this.state.snippetForm.video.value}
                  disabled={(this.state.snippetForm.video.value==null || this.state.snippetForm.title=="")?true:false}
                />
                {this.state.videoUploaded && !this.state.videoEncoded && (
                  <small>
                    Please wait while we finish processing your video
                  </small>
                )}
              </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:w-6/12 xl:w-7/12 preview-pane">
             <div className="text-center text-light-rose-dark font-bold mb-2">
              Preview
            </div>

            <div className="bg-light-rose h-full border-l border-gray-200 py-6 px-6 sm:px-12 2xl:px-16 preview-window new">
           
              {this.state.snippetForm.logoImage.value && (
                <div
                  className={`logo ${this.state.snippetForm.logoImage.alignment}`}
                >
                  <img
                    src={this.state.snippetForm.logoImage.url}
                    className=""
                    style={{
                      display: "inline-block",
                      width: this.state.snippetForm.logoImage.width + "px",
                      marginBottom:"16px",
                    }}
                  />
                </div>
              )}
              {this.state.snippetForm.coverImage.value &&
                this.state.snippetForm.coverImage.placement === "above" && (
                  <div className="cover">
                    <img
                      src={this.state.snippetForm.coverImage.url}
                      style={{
                        marginBottom:
                          +this.state.snippetForm.coverImage.spacing * 8,
                      }}
                    />
                  </div>
                )}
              {this.state.snippetForm.video.url && (
                <div className="video videoStyle">
                   { (this.state.addVideoOverlay?(
                    <span className="micon">
                      { (this.state.snippetForm.video.overlay=='black')?
                       
                      <img
                                    src={require(`./../../../content/img/gif-overlay-black.png`)}
                                    className="w-6"
                                    alt=""
                        />
                        :
                       <img
                                    src={require(`./../../../content/img/gif-overlay-white.png`)}
                                    style={{ padding: "2px" }}
                                    className="w-6"
                                    //className="w-6 bg-gray-800"
                                    alt=""
                                  />
                        }
                      </span>
                     ):"")}
                  <video ref={this.videoRef} 
                    muted
                    autoPlay
                    controls
                    playsInline
                    src={this.state.snippetForm.video.url}
                    style={{ 
                    height:this.state.playerHeight>600 ? "600px":"auto",
                    objectFit:"cover",
                     }}
                  />
                </div>
              )}
              {this.state.snippetForm.coverImage.value &&
                this.state.snippetForm.coverImage.placement === "below" && (
                  <div className="cover">
                    <img
                      src={this.state.snippetForm.coverImage.url}
                      style={{
                        marginTop:
                          +this.state.snippetForm.coverImage.spacing * 8,
                      }}
                    />
                  </div>
                )}
              {this.state.snippetForm.ctaButtons.buttons && (
                <div
                  className="buttons-panel"
                  style={{
                    display: "inline-block",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap:"15px",
                    marginTop:"15px",
                    textAlign:"center",
                  }}
                >
                  {this.state.snippetForm.ctaButtons.buttons.map((button) => { 
                 
                    return (
                      <span
                        className="preview-button"
                        style={{
                          backgroundColor: button.backgroundColor,
                          color: button.fontColor,
                          borderRadius: `${button.radius}px`,
                          fontWeight: button.bold ? "bold" : "normal",
                          /*minWidth: "45%",*/
                          width:"auto",
                         /* margin: "auto",*/
                          wordWrap: "break-word",
                          textAlign: "center",
                          padding: `${button.padding}`,
                          marginTop :"15px",
                          display:"inline-block",
                         marginRight:"10px",

                        }}
                      >
                        <a
                          style={{
                            fontSize: `${button.fontSize}`,
                            color: button.fontColor,
                            fontWeight: this.state.buttonForm.bold.value
                              ? "bold"
                              : "",
                          }}
                          href={button.url}
                          target="_blank"
                        >
                          {button.title}
                        </a>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
 
   

        <Transition visible={true} animation="scale" duration={700}>
          <Modal
            dimmer={"blurring"}
            open={this.state.showLoadingModal}
            closeOnDimmerClick={false}
          >
           <Modal.Content>
             {/*   <h1>Please wait!</h1>
              <h4>
                 <img
                  className="w-32 w-auto mb-6 mx-auto block"
                  src={require(`../../../content/img/processing.gif`)}
                  alt=""
                /> 
                Please hold on while we finish processing your video, this will
                only take about a minute ...
              </h4>
               <ProgressBar completed={this.state.progress} maxCompleted={100}  bgColor="#208f31" />  */}  
                <h1>Please wait!</h1>
                <div className="custom-loader" style={{ "display" : (this.state.showLoadingModal)?"block":"none"}} >
                        <div className="loaderCompund">
                          <div className="spinner-border" role="status">    
                          </div>  
                          <span className="loader-img">
                            <img src={require(`../../../content/img/processing.538ac49c.gif`)} />
                          </span>
                        </div>
                        <div className="text-item">
                           <h4>  
                                Please hold on while we finish processing your video, this will only take about a minute ...
                          </h4>
             
                          <ProgressBar completed={this.state.progress} maxCompleted={100}  bgColor="#208f31" /> 
                        </div>
                      </div>


            </Modal.Content>
                 
             {/*    <div className="custom-loader" style={{ "display" : (this.state.showLoadingModal)?"block":"none"}} >
                        <div className="loaderCompund">
                          <div className="spinner-border" role="status">  	
                          </div>	
                          <span className="loader-img">
                            <img src={require(`../../../content/img/processing.538ac49c.gif`)} />
                          </span>
                        </div>
                     
                      </div>  */}

          </Modal>
        </Transition>

  

                     

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.UserReducer.User,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSnippet);
export { connectedComponent as CreateSnippet };

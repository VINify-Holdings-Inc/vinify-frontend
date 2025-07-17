import React, { Component } from "react";
import { GetSnippetsBriefList } from "../../../actions/snippet";
import { SupportRequest } from "../../../actions/support";
import {
    Icon,
    TextBox,
    TextArea,
    Button,
    ColorPicker,
    Select,
    CheckBox,
} from "../../../components/html";
import { FileDropzone } from "../../../components/shared";
import notification from "../../../core/services/alert";
import formValidator from "../../../core/services/formValidator";
import { Loading } from '../../shared';

import Swal from 'sweetalert2'

class SupportForm extends Component {

    state = {
        form: {
            type: {
                label: "Inquiry Type",
                value: "",
                options: [
                    { value: 'General Inquiry', text: "General Inquiry" },
                    { value: 'Feature Suggestion', text: "Feature Suggestion" },
                    { value: 'Bug / Issues', text: "Bug / Issues" },
                    
                ],
                required: true,
                errorMessage: "Invalid Field",
                id: "type",
                name: "type",
                placeholder: "Please select an option",
                onChange: (event) => this._onChange(event),
                fluid: true,
                selection: true,
                multiple: false
            },
            eyemail: {
                label: "Specific Issue",
                value: "",
                options: [],
                errorMessage: "Invalid Field",
                id: "eyemail",
                name: "eyemail",
                placeholder: "?",
                onChange: (event) => this._onChange(event),
                helpText: "Optionally select the EyeMail in which you encountered the bug",
                fluid: true,
                selection: true,
                multiple: false
            },
            message: {
                label: "Message",
                value: "",
                rows: 4,
                required: true,
                errorMessage: "Invalid Field",
                id: "message",
                placeholder: "Please type your message here",
                onChange: (event) => this._onChange(event),
                fluid: true,
            },
            attachments: {
                files: []
            },
        },
        uploadAttachMents:false,
    }
    

    componentDidMount() {
        this.getSnippets();
         this.setState({
             loading: false
           });
    }

    getSnippets = async () => {
        try {
            let response = await GetSnippetsBriefList();

            if (response.result) {
                let form = this.state.form;
                form.eyemail.options = response.body.map(snippet => ({
                    text: snippet.title, value: snippet.snippet
                }))
                this.setState({
                    form: form,
                });
            } else {
                notification.error(response.message, 'snippetRetrievalFailed');
            }
        } catch (error) {
            notification.error("Unable to load snippets", 'snippetRetrievalFailed');
        }
        finally {
        }
    }

    submitForm = async () => {
        this.setState({ loading: true });
        let data = {
            type: this.state.form.type.value,
            snippetId: this.state.form.eyemail.value,
            message: this.state.form.message.value,
            attachments: this.state.form.attachments.files,
        };
        let response = await SupportRequest(data);
        //console.log("support form",response);
        if (response.result) {
             this.setState({ loading: false });
            
            // notification.success("We've received your inquiry, our team will be in touch with you over the email.");
             //  alert("");
              // Swal.fire("We've received your inquiry, our team will be in touch with you over the email.");
              /* Swal.fire({
                      title: "",
                      text: "We've received your inquiry, our team will be in touch with you over the email.",
                      icon: "success"
                    });  */

                    Swal.fire({
                        title: "",
                        text: "Thank you for your inquiry. A team member will be in touch with you shortly.",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonColor: 'rgb(200 19 27)',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                       // console.log("result",result);
                        if (result.value) {
                           
                          // Perform the redirect
                          this.clearForm();
                        }
                      });
            //this.clearForm();
        } else {
            notification.error(response.message, "snippetCreateFailed");
        }
    }

    clearForm = () => {
        window.location.href = window.location.href;
    //     let form = this.state.form;
    //      form.attachments.files.map((x)=>{
    //         //this._onAttachmentRemove(x);
    //         this.handleClick(x)
    //     })
        
    //   this.handleSelectText();

    //   //  form.type.value = "";
    //     form.eyemail.value = "";
    //     form.message.value = "";
    //     form.attachments.files = [];
    //     this.setState({
    //         form: form,
    //     });

    }

    _onClickSend = (ev) => {
        ev.preventDefault();

        const { isValid, form } = formValidator(this.state.form);
        this.setState({
            form: form,
        });
        if (isValid) {
            this.submitForm();
        } else {
        }
    };

    _onChange = (event) => {
        let form = this.state.form;
        form[event.target.name].value = event.target.value;
        this.setState({
            form: form,
        });
    };

    _onUploadAttachment = (imageUploadRes) => {
       // console.log("xxx",this.state);
        let form = this.state.form;
        const { fileId, url } = imageUploadRes.body;
        form.attachments.files.push(fileId);

        this.setState({
            form: form,
            uploadAttachMents:false,
        });
        return true;
    };

    _onAttachmentUploadFail = () => {
        return true;
    };

    _onAttachmentRemove = (file) => {
        console.log('REMOVING FILE ID', file)

    //     let form = this.state.form;
    //     form.attachments.files = form.attachments.files.filter(f => f != fileId);
    //    // console.log('UPDATED FILES', form.attachments.files);
    //     this.setState({
    //         form: form,
    //     });

    this.setState(prevState => ({
        form: {
            ...prevState.form,
            attachments: {
                ...prevState.form.attachments,
                files: prevState.form.attachments.files.filter((f) => f !== file.fileId && f !== file.name) 
            }
        }
    }));
        return true;
    };
    _onChanging = (e) =>{
       // console.log("",e[0]);
       let x = this.state.uploadAttachMents=true
       this.setState({...this.state,x})
       console.log("onChange",this.state.form.attachments.files);
    }


 handleClick = (id) => {
   
    const button = document.getElementById(id).querySelector('.icon.fas.fa-times');

    if (button) {
    //  button.click();
    }
  };

 handleSelectText = () => {
   /*
    const ele = document.getElementById('type').querySelector('.divider.text');
  //console.log("ttr",ele);
        ele.innerHTML="";
    */
        let oldState = { ...this.state };;
    let    formType={
            label: "Inquiry Type",
            value: "",
            options: [
                { value: 'General Inquiry', text: "General Inquiry" },
                { value: 'Feature Suggestion', text: "Feature Suggestion" },
                { value: 'Bug / Issues', text: "Bug / Issues" },
                
            ],
            required: true,
            errorMessage: "Invalid Field",
            id: "type",
            name: "type",
            placeholder: "Please select an option",
            onChange: (event) => this._onChange(event),
            fluid: true,
            selection: true,
            multiple: false
        }
        oldState.type=formType;
        this.setState({...oldState});



  };

    render() {
        return <div>
            <form noValidate onSubmit={this._onClickSend} className='space-y-6'>
                <Select {...this.state.form.type} />
                {
                    this.state.form.type.value === 'Bug / Issues' && <Select {...this.state.form.eyemail} />

                }
                <TextArea {...this.state.form.message} />
                <div>
                    <label style={{ fontWeight: 600 }}>Attachments (up to 3 images)</label>
                    <FileDropzone
                        type="image"
                        fileTypes=".png,.jpg,.jpeg"
                        onSuccess={this._onUploadAttachment}
                        onFailure={this._onAttachmentUploadFail}
                        onBeforeFileRemove={this._onAttachmentRemove}
                        onChange={this._onChanging}
                        maxFiles={3}
                    />
                </div>
                <div className="mt-3 text-right">
                    <Button
                        category="primary"
                        type="submit"
                        size={"small"}
                        title="Send"
                        disabled={this.state.loading || this.state.uploadAttachMents ? true:false}
                    />
                     {this.state.loading ? (
                    <div className='ui center aligned grid'>
                      <Loading />
                    </div>
                  ) : null}
                </div>
            </form>
        </div>
    }
}

export { SupportForm }
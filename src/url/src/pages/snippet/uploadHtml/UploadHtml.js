import React, { Component } from 'react';
import history from '../../../history';

import { SelectVideo, PreviewVideoWithCancelButton } from '../../../components/video';
import { FileUpload, SnippetCampaignUrl, SnippetCampaignWidth, SnippetCampaignTitle } from '../../../components/html';

import alert from '../../../core/services/alert';
import { SnippetCreate } from '../../../actions/snippet';

class UploadHtml extends Component {

    constructor(props) {

        super(props);

        this.changeVideo = this.changeVideo.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.urlChangeHandler = this.urlChangeHandler.bind(this);
        this.changeHtmlFile = this.changeHtmlFile.bind(this);
        this.saveSnippet = this.saveSnippet.bind(this);

        this.state = {
            video: null,
            width: '',
            url: '',
            htmlFile: null,
            title: ''
        }

    }

    changeVideo(video) {
        this.setState({
            video: video
        });
    }

    changeHtmlFile(file) {
        this.setState({
            htmlFile: file
        });
    }

    changeHandler(eve) {
        this.setState({
            [eve.target.name]: eve.target.value
        })
    }

    urlChangeHandler(value) {
        this.setState({
            url: value
        })
    }

    async saveSnippet() {

        window.onbeforeunload = function () {
            return 'EyeMail creation in progress, Do you want to leave the page?';
        };
        if (this.state.width < 100) {
            document.getElementById('newSnippetWidth').classList.add('is-invalid');
        }
        else {
            alert.infoLoading('Creating Your Eyemail \nSnippet');
            let snippet = {
                videoId: this.state.video.videoId,
                title: this.state.title,
                width: this.state.width,
                htmlFileId: this.state.htmlFile,
                campaignUrl: this.state.url,
            }

            var response = await SnippetCreate(snippet);

            if (response.status) {
                alert.success('EyeMail created')
                history.push(response.snippetId);
            }
            else {
                alert.error('Unable to create EyeMail.\nPlease try again');
            }

        }
        window.onbeforeunload = undefined;

    }

    render() {
        return (
            <div className='page-container'>

                <h1>Add Video To Your Email</h1>

                <div className='row'>
                    <div className='col-sm-12 col-md-6 order-md-2 mt-4'>
                        <div className='well'>
                            <h5 className='mb-4'>
                                Integrate EyeMail Video Technology into your existing email templates
                            </h5>
                            <p>
                                <b>1. </b>
                                Upload your email in html file format and put <span className='important'>&lt;eyemail/&gt;</span> in your html file where you want the video to display
                                <ul>
                                    <li>Optionally, specify width for the video container (in pixels)<br /><span className='important'>&lt;eyemail width="600"/&gt;</span></li>
                                    <li>Supported formats are .html and .txt</li>
                                </ul>
                            </p>
                            <p>
                                <b>2. </b>
                                Upload the video and we will magically compress and integrate into you html
                                <ul>
                                    <li>Supported formats are .mp4 and .mov</li>
                                </ul>
                            </p>
                            <p>
                                <b>3. </b>
                                Download the compiled and compressed email code back in html format
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6 order-md-1'>
                        <div>
                            <div className='row'>
                                <div className='col-lg-12 mt-4'>
                                    <FileUpload title='Upload HTML File' selectedFile={this.state.htmlFile} onChange={this.changeHtmlFile} footer='.HTML or .TXT file' type='File' /><span className='badge top-right'>1</span>
                                </div>
                                <div className='col-lg-12 mt-4'>
                                    <FileUpload title='Upload Video File' uploader={
                                        this.state.video == null ?
                                            <SelectVideo selectedVideo={this.state.video} onChangeVideo={this.changeVideo} />
                                            : <PreviewVideoWithCancelButton video={this.state.video} onChange={this.changeVideo} />
                                    } footer='.MP4 or .MOV file' /> <span className='badge top-right'>2</span>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <SnippetCampaignWidth width={this.state.width} onChange={this.changeHandler} />
                                <SnippetCampaignUrl url={this.state.url} onChange={this.urlChangeHandler} label='Url where the online version of the email will be hosted:' />
                                <SnippetCampaignTitle title={this.state.title} onChange={this.changeHandler} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-sm-12'>
                        <button disabled={
                            this.state.video == null ||
                            this.state.htmlFile == null ||
                            this.state.title === '' ||
                            this.state.width === ''
                        }
                            onClick={this.saveSnippet}
                            className='btn btn-outline'>Create EyeMail</button>
                    </div>
                </div>

            </div>
        )
    }
}

export { UploadHtml };

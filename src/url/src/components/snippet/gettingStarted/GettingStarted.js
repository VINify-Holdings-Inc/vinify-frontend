import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Player} from 'video-react';
import {Accordion, Icon as AccordionIcon} from 'semantic-ui-react';

// import './GettingStarted.scss';

import {Button, Icon, TextBox} from '../../../components/html';
import {UploadVideo} from '../../../components/snippet';

import site from '../../../sitemap';
import notification from '../../../core/services/alert';
import formValidator from '../../../core/services/formValidator';
import {SnippetCreate} from '../../../actions/snippet';
import {EncodeVideoFile, GetFileUrl} from '../../../actions/file';
import {VideoModal} from '../../video';
import Config from '../../../core/config';

const {Title, Content} = Accordion;

class GettingStarted extends Component {
    // State

    config = {};

    state = {
        snippetForm: {
            video: {
                value: '',
                label: 'Video',
                errorMessage: 'Video is required.',
                regex: /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi,
                required: true
            },
            title: {
                label: 'Title',
                value: '',
                required: true,
                id: 'title',
                placeholder: 'Give this project a name',
                type: 'text',
                onChange: event => this._onChange(event),
                fluid: true
            },
            width: {
                label: 'Width (px)',
                value: '',
                id: 'width',
                placeholder: '600px',
                type: 'number',
                onChange: event => this._onChange(event),
                fluid: true,
                helpText:
                    'Width in pixels for the video to occupy in your email html. Defaults to 600px'
            }
        },
        contextVideo: {
            videoUrl: null,
            thumbnailUrl: null
        },
        startConsent: false,
        videoUploaded: false,
        videoEncoded: false,
        createSnippet: false,
        activeIndex: -1
    };

    // Events

    _onChange = event => {
        let snippetForm = this.state.snippetForm;
        snippetForm[event.target.name].value = event.target.value;
        this.setState({
            snippetForm: snippetForm
        });
    };

    _onClickGettingStarted = () => {
        this.setState({
            startConsent: true
        });
    };

    _onClickOptionCreate = () => {
        this.setState({
            createSnippet: true
        });
    };

    _onChangeVideo = res => {
        let snippetForm = this.state.snippetForm;
        const {fileId, url} = res.body;
        snippetForm.video.value = fileId;
        this.setState({
            snippetForm: snippetForm,
            // contextVideo: {
            //   videoUrl: 'https://staging-assets-dev.s3.us-east-2.amazonaws.com/' + videoFileId + '.mp4',
            //   thumbnailUrl: 'https://staging-assets-dev.s3.us-east-2.amazonaws.com/' + videoFileId + '.jpg',
            // },
            videoUploaded: true,
            // videoEncoded: true
        });
        this.encodeVideo(fileId);
    };

    // _onClickAccordion = (e, titleProps) => {
    //   const { index } = titleProps;
    //   const { activeIndex } = this.state;
    //   const newIndex = activeIndex === index ? -1 : index;

    //   this.setState({ activeIndex: newIndex });
    // };

    _onClickCreateSnippet = ev => {
        ev.preventDefault();

        const {isValid, form} = formValidator(this.state.snippetForm);
        this.setState({
            snippetForm: form
        });
        if (isValid) {
            this.createSnippet();
        }
    };

    // Utils

    encodeVideo = async fileId => {
        let res = await EncodeVideoFile(fileId);
        const {videoUrl, thumbnailUrl} = res.body;
        if (res.result) {
            this.setState({
                contextVideo: {
                    videoUrl: videoUrl,
                    thumbnailUrl: thumbnailUrl
                },
                videoEncoded: true,
            });
        }
    };

    createSnippet = async () => {
        let snippet = {
            title: this.state.snippetForm.title.value,
            videoId: this.state.snippetForm.video.value,
            width: parseInt(this.state.snippetForm.width.value || 600)
        };
        let response = await SnippetCreate(snippet);
        if (response.result) {
            window.location.href = `${site.routes.viewSnippet.route}/${response.body}`;
        } else {
            notification.error(response.message, 'snippetCreateFailed');
        }
    };

    render() {
        return (
            <div className='cmp-getting-started'>
                <h2 className='text-xl font-bold'>Getting Started</h2>
                <p className='mt-1'>Let’s upload, encode and compress your video, to create some EyeMail Magic special
                    for you.</p>

                <div className='mt-6'>
                    {this.state.startConsent ? (
                        !this.state.videoUploaded ? (
                                <>
                                    <h2 className='text-lg font-bold text-center'>Let's upload a video first</h2>
                                    <UploadVideo onSuccess={this._onChangeVideo}/>
                                </>
                            ) :
                            // !this.state.createSnippet ? (
                            //   <div className='ui center aligned grid'>
                            //     <div className='column'>
                            //       <div className='ui icon header'>
                            //         {this.state.videoEncoded ? (
                            //           'Your video has been encoded successfully!'
                            //         ) : (
                            //             <>
                            //               Please wait while we upload and process your video...
                            //             <Icon
                            //                 className='icon-processing-video'
                            //                 icon='sync'
                            //                 spin={true}
                            //                 size='1.5'
                            //               />
                            //             </>
                            //           )}
                            //       </div>
                            //       <div className=''>Here are your next steps</div>
                            //       <div className='option-buttons'>
                            //         <Button
                            //           disabled={!this.state.videoEncoded}
                            //           category={'basic'}
                            //           size={'large'}
                            //           title='Download Compressed'
                            //           onClick={this._onClickDownload}
                            //         />
                            //         <Button
                            //           category={'primary'}
                            //           size={'large'}
                            //           title='Create an EyeMail EyeMail'
                            //           onClick={this._onClickOptionCreate}
                            //         />
                            //       </div>
                            //     </div>
                            //   </div>
                            // ) :
                            (
                                <div className='bg-light-gray px-5 py-16 rounded border border-gray-200 flex items-center justify-center'>
                                    <div className='row'>
                                        <div
                                            className='ten wide computer sixteen wide tablet sixteen wide mobile column'>
                                            {/* <Player
                        playsInline
                        poster={require(`../../../content/img/default-video-thumbnail.png`)}
                        src={GetFileUrl(this.state.snippetForm.video.value)}
                        autoPlay={false}
                        aspectRatio={'16:9'}
                      /> */}
                                            {
                                                !this.state.videoEncoded &&
                                                <div className='ui icon header'>
                                                    <p className='font-bold'>
                                                        <Icon
                                                            className='icon-processing-video mr-2'
                                                            icon='sync'
                                                            spin={true}
                                                            size='1'
                                                        />
                                                        We're processing your video. Encoding and optimizing for
                                                        email...
                                                    </p>
                                                </div>
                                            }
                                            {
                                                this.state.videoEncoded &&
                                                <>
                                                    <div>
                                                        <video playsinline controls
                                                               style={{maxWidth: '600px'}}
                                                               poster={this.state.contextVideo.thumbnailUrl || require(`../../../content/img/default-video-thumbnail.png`)}
                                                               src={this.state.contextVideo.videoUrl}/>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            inline={true}
                                                            transparent={true}
                                                            linkTarget={'_blank'}
                                                            link={this.state.contextVideo.videoUrl}
                                                            iconType={'solid'}
                                                            icon={'cloud-download-alt'}
                                                            title='Download'
                                                            className='p-0'
                                                        />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div
                                            className='mt-5 six wide computer sixteen wide tablet sixteen wide mobile column'>
                                            <div className='ui grid'>
                                                <div className='column'>
                                                    <div className='form'>
                                                        <form noValidate onSubmit={this._onClickCreateSnippet}>
                                                            <TextBox {...this.state.snippetForm.title} />
                                                            <TextBox {...this.state.snippetForm.width} />
                                                            <Button
                                                                category='primary'
                                                                type='submit'
                                                                size={'small'}
                                                                title='Create EyeMail'
                                                                disabled={!this.state.videoEncoded}
                                                            />
                                                            {
                                                                (this.state.videoUploaded && !this.state.videoEncoded) &&
                                                                <small>Please wait while we finish processing your
                                                                    video</small>
                                                            }
                                                        </form>
                                                    </div>
                                                    {/* <Button
                            disabled={!this.state.videoEncoded}
                            category={'primary'}
                            size={'large'}
                            title='Download'
                            onClick={this._onClickDownload}
                          /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    ) : (
                        <>
                            <div className="mt-8 bg-light-gray px-5 py-20 rounded border border-gray-200 flex items-center justify-center">
                                <div>
                                    <svg className='mx-auto mb-4' xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                                         viewBox="0 0 24 24">
                                        <path
                                            d="M24 1l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-13 8.63c1.013-1.574 1.955-2.256 2.938-2.55l.234 1.448c-.663.256-1.215.806-1.965 1.971l-1.207-.869zm11-4.729c-.928 1.473-1.748 2.104-2.566 2.322l.254 1.436c.746-.176 1.521-.583 2.312-1.391v-2.367zm-3.855 2.385c-.883-.103-1.92-.365-2.938-.376l.236 1.462c.873.068 1.931.345 2.963.395l-.261-1.481z"/>
                                    </svg>

                                    <Button
                                        category={'brand'}
                                        size={'large'}
                                        title='Create your EyeMail'
                                        onClick={this._onClickGettingStarted}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(GettingStarted);

export {connectedComponent as GettingStarted};

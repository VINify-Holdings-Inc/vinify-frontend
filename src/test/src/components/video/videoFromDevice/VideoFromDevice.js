import React, { Component } from 'react';

class VideoFromDevice extends Component {

    constructor(props) {
        super(props);
    }

    async fileSelect(videoFile) {
        if (videoFile.length > 0) {
            this.props.onFileSelect(videoFile)
        }
    }

    render() {
        return (
            <input type='file' accept='.mp4,.mov'
                onChange={(e) => {
                    this.fileSelect(e.target.files)
                }} hidden />
        )
    }
}

export { VideoFromDevice };
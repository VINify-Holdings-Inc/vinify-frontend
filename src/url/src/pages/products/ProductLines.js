import React, {Component} from 'react';
import {connect} from 'react-redux';

class ProductLines extends Component {
    //Render

    render() {
        return (
            <div>
                <div>
                    <h1 className='text-2xl font-bold'>Product Lines</h1>
                    <p className='mt-1'>Learn more about our products and services.</p>
                </div>

                <div className='grid lg:grid-cols-2 lg:gap-x-8 gap-y-8 mt-6'>
                    <div className='border border-gray-200 rounded p-8 md:p-10'>
                        <img className="h-10 mb-3"
                             src={require(`../../content/img/brand/eyecon.jpg`)} alt=""/>

                        <p className='font-bold text-lg mb-2'>Bring Your Logo to Life</p>

                        <p className='text-gray-600 mb-3'>EyeCon delivers an interactive animated logo experience, as
                            part of
                            your brand experience. Ideal to celebrate a company milestone or to highlight a new product
                            or initiative.</p>

                        <a href="https://eyemailinc.com/solutions/eyecon/" target='_blank' className='text-primary underline font-bold'>Learn More</a>
                    </div>

                    <div className='border border-gray-200 rounded px-4 p-8 md:p-10'>
                        <img className="h-10 mb-3"
                             src={require(`../../content/img/brand/eyesign.jpg`)} alt=""/>

                        <p className='font-bold text-lg mb-2'>Bring your Signature Line to Life</p>

                        <p className='text-gray-600 mb-3'>Your handwritten signature is unique, personalized and
                            original. Add your personal stamp of approval to documents, letters and email
                            communications. </p>

                        <a href="https://eyemailinc.com/solutions/eyesign" className='text-primary underline font-bold'>Learn More</a>
                    </div>

                    <div className='border border-gray-200 rounded px-4 p-8 md:p-10'>
                        <img className="h-10 mb-3"
                             src={require(`../../content/img/brand/eyephoto.png`)} alt="."/>

                        <p className='font-bold text-lg mb-2'>Bring Your Photos to Life</p>

                        <p className='text-gray-600 mb-3'>No videos, no problem. Another touch-point to deliver
                            compelling animated experiences with your photos.</p>

                        <a href="https://eyemailinc.com/solutions/eyephoto" className='text-primary underline font-bold'>Learn More</a>
                    </div>

                    <div className='border border-gray-200 rounded px-4 p-8 md:p-10'>
                        <img className="h-10 mb-3"
                             src={require(`../../content/img/brand/eye-viewer.png`)} alt=""/>

                        <p className='font-bold text-lg mb-2'>EyeViewer Assistant (EVA)</p>

                        <p className='text-gray-600 mb-3'>The EyeViewer Assistant (EVA) empowers you to prioritize
                            emails and names, to remain at the top of your email inbox.</p>

                        <a href="#" className='text-primary underline font-bold'>Learn More</a>
                    </div>

                    <div className='border border-gray-200 rounded px-4 p-8 md:p-10'>
                        <img className="h-10 mb-3"
                             src={require(`../../content/img/brand/eyeq.jpg`)} alt=""/>

                        <p className='font-bold text-lg mb-2'>A digital Touchpoint</p>

                        <p className='text-gray-600 mb-3'>Extend your digital presence with custom designed QR code to
                            showcase your live products, presentations and personalized contact card.</p>

                        <a href="#" className='text-primary underline font-bold'>Learn More</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.User,
        sitemap: state.FlagReducer.Sitemap
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductLines);
export {connectedComponent as ProductLines};

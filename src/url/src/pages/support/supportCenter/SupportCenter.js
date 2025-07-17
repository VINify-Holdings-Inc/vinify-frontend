import React, {Component} from 'react';
import {Accordion, Container, Header, Icon, Card} from 'semantic-ui-react';

import {SupportForm} from '../../../components/support';

import './SupportCenter.scss'

class SupportCenter extends Component {

    state = {activeFAQIndex: 0}

    faqs = [{
        title: 'What is the recommended length of an EyeMail Campaign?',
        content: "EyeMail is like the perfect appetizer - short, sweet and invites you to want more. 30 seconds is ideal. Our patent-pending technology has the ability to deliver up to 60 seconds of automatic play video, to ensure audience engagement and to inspire a call to action."
    },
        {
            title: 'What size and format should we submit our video?',
            content: "MP4 video format and recommended under 200 MB."
        },
        {
            title: 'Do I have to switch my current Email Service Provider (ESP) System to use EyeMail solution?',
            content: "EyeMail is built agnostic, and performs seamlessly with any ESP or CRM tool, that allow HTML file upload. Our niche is bringing the sizzle to bring email to life and we enjoy partnering with ESPs to support campaign launches!"
        },
        {
            title: 'How is EyeMail different than a standard Email marketing campaign?',
            content: "Email campaigns delivers static images, hyperlinks, or a still graphic with a big play button where viewers have to click to engage or a 3-5 second looping GIF. EyeMail delivers automatic play of video (up to 60 seconds) in the email inbox and mobile to increase engagement. Delivers a competitive edge to stand out from the inbox clutter."
        },
        {
            title: 'Does EyeMail solution increase SPAM deliverability, bandwidth or firewall issues?',
            content: "EyeMail is compressed, encoded and optimized to deliver a light payload, at an average file size of 15kb, no attachments or bandwidth issues. Adding video in email does not increase spam filtering."
        },
        {
            title: 'What are some application uses of EyeMail?',
            content: "Customer Communications, Event Marketing, Employee Engagement. Including but not limited to: Product and Service introductions, Sales & Marketing, Company Introductions, Holiday Messaging, Investor Stakeholder communications, Executive Leadership, Welcome Messages, Event Invitations, Event Thank you & Surveys, HR, Training and Executive Communications, Sponsorships, Foundations and several other use cases."
        },
        {
            title: 'Does EyeMail perform on email and mobile device?',
            content: "Yes, EyeMail performs on all email. webmail and mobile platforms."
        },
        {
            title: 'What is EyeMail’s Mission?',
            content: "We believe your message deserves to be Seen, Heard and Felt. Our mission is to inspire engagement and deliver storytelling moments in the email inbox."
        }]

    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeFAQIndex} = this.state
        const newIndex = activeFAQIndex === index ? -1 : index

        this.setState({activeFAQIndex: newIndex})
    }

    render() {
        const {activeFAQIndex} = this.state

        return <div>
            <div>
                <div>
                    <h1 className='text-2xl font-bold mb-0'>Welcome to EyeMail Support</h1>
                    <p className='mt-1'>FAQs, Contact and Chat</p>
                </div>

                <div className='ui mt-5'>
                    <div className='row'>
                        <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
                            <h2 className='text-xl font-bold pb-3'>Frequently Asked Questions</h2>
                        </div>

                        <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
                           
                                {
                                    this.faqs.map((faq, index) => 
                                     <Accordion key={index} fluid styled >
                                        <Accordion.Title
                                            active={activeFAQIndex === index}
                                            index={index}
                                            onClick={this.handleClick}
                                        >
                                            <Icon name='dropdown'/>
                                            {faq.title}
                                        </Accordion.Title>
                                        <Accordion.Content active={activeFAQIndex === index}>
                                            <p>{faq.content}</p>
                                        </Accordion.Content>
                                       </Accordion> 
                                    )
                                }
                            
                        </div>
                    </div>
                </div>

                <div className='mt-12'>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold mb-0'>Contact us</h2>
                        <p className='pb-3'>We are here to help! We’ll be in contact soon</p>
                    </div>

                    <div className='shadow-lg rounded px-8 py-6 mx-auto max-w-5xl border border-gray-200'>
                        <SupportForm/>
                    </div>
                </div>
            </div>
        </div>
    }
}

export {SupportCenter}
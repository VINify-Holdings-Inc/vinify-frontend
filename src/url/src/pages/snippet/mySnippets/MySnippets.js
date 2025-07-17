import React, {Component} from 'react';
import {connect} from 'react-redux';

import './MySnippets.scss';

import {SnippetsList} from '../../../components/snippet';
import {Loading} from '../../../components/shared';

import {GetSnippets} from '../../../actions/snippet';
import {Icon, TextBox, Select, Button} from '../../../components/html';
import notification from '../../../core/services/alert';

import site from '../../../sitemap';
import QueryParser from '../../../core/helpers/queryParser';
import config from '../../../core/config/config.development';
import QueryGenerator from '../../../core/helpers/queryGenerator';
import FormInitializer from '../../../core/helpers/formInitializer';
import {ButtonLink} from "../../../components/html/buttonLink/ButtonLink";

class MySnippets extends Component {
    //State

    state = {
        searchForm: {
            query: {
                value: '',
                required: true,
                errorMessage: 'Invalid Field',
                id: 'query',
                placeholder: 'Search...',
                type: 'text',
                onChange: (event) => this._onChange(event),
                labeled: true,
                fluid: true,
                button: {
                    basic: true,
                    iconType: 'solid',
                    icon: 'search',
                    className: 'btn-search',
                    onClick: (event) => this._onClickSearchSnippet(event),
                },
            },
            status: {
                options: [
                    {value: '-', text: 'All'},
                    {value: 'true', text: 'Active'},
                    {value: 'false', text: 'Inactive'},
                ],
                value: '',
                selection: true,
                required: true,
                id: 'status',
                name: 'status',
                placeholder: 'Select Status',
                onChange: (event) => this._onSelectChange(event),
            },
        },
        loadingSnippets: true,
        snippets: [],
    };

    //LifeCycle Events

    componentDidMount = async () => {
        let queryParser = new QueryParser(
            window.location.search,
            config.searchSnippetsParam
        );
        let stateInitializer = new FormInitializer(
            this.state,
            queryParser.parse(),
            'searchForm'
        );
        stateInitializer.initializer();
        this.getSnippets();
    };

    //Events

    _onChange = (event) => {
        let searchForm = this.state.searchForm;
        searchForm[event.target.name].value = event.target.value;
        this.setState({
            searchForm: searchForm,
        });
    };

    _onSelectChange = (event) => {
        let searchForm = this.state.searchForm;
        searchForm[event.target.name].value = event.target.value;
        this.setState(
            {
                searchForm: searchForm,
            },
            () => this.searchSnippets()
        );
    };

    _onClickSearchSnippet = (event) => {
        if (event) {
            event.preventDefault();
        }
        this.searchSnippets();
    };

    //Utils

    getSnippets = async () => {
        this.setState({
            loadingSnippets: true,
        });
        try {
            let query = '?';
            if (this.state.searchForm.query.value != '') {
                query += `query=${this.state.searchForm.query.value}`;
            }
            if (
                this.state.searchForm.status.value != '' ||
                this.state.searchForm.status.value != '-'
            ) {
                query += `&status=${this.state.searchForm.status.value}`;
            }
            let response = await GetSnippets(query);

            if (response.result) {
                this.setState({
                    snippets: response.body,
                });
            } else {
                notification.error(response.message, 'snippetRetrievalFailed');
            }
        } catch (error) {
            notification.error("Unable to load snippets", 'snippetRetrievalFailed');
        } finally {
            this.setState({
                loadingSnippets: false,
            });
        }
    };

    searchSnippets = () => {
        let queryGenerator = new QueryGenerator(
            this.state,
            config.searchSnippetsParam,
            'searchForm'
        );
        window.location.href = `${site.routes.mySnippets.path
        }?${queryGenerator.generator()}`;
    };

    render() {
        return (
            <div>
                <header>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-2xl font-bold'>My EyeMails</h1>

                        <ButtonLink type='secondary' size='small' addIcon='true'
                                    href={this.props.sitemap.routes.createSnippet.path} text='New EyeMail'/>
                    </div>

                    <form noValidate onSubmit={this._onClickSearchSnippet}>
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0 mb-8 gap-y-5 md:gap-x-8">
                            <TextBox {...this.state.searchForm.query} className='w-full md:w-8/12' />

                            <Select {...this.state.searchForm.status} />
                        </div>
                    </form>
                </header>

                <div>
                    { this.state.loadingSnippets
                        ? ( <Loading/> )
                        : ( <SnippetsList show={this.props.show} snippets={this.state.snippets}/> )
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sitemap: state.FlagReducer.Sitemap,
        // viewType: state.Flags.ViewType,
        // videoUploading: state.Flags.VideoUploading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // ViewSnippetDispatch: view => {
        //   dispatch(ViewSnippet(view));
        // }
    };
}

const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(MySnippets);
export {connectedComponent as MySnippets};

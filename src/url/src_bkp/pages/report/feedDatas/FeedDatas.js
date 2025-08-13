import React, { Component } from "react";
import { connect } from "react-redux";

import "./FeedDatas.scss";

import { Loading } from "../../../components/shared";

import axios from 'axios'; 
import site from "../../../sitemap";
class FeedDatas extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    //console.log("props",props);
  }
  
  // State
  state = {
    loading: true,
    id: this.props.match.params.id,
    type: this.props.match.params.type,
    data:""
  };



  // LifeCycle Events

  componentDidMount = async () => {
    
    await this._handleGenerateCode();
  };

  // Utils
  _handleGenerateCode = async () => {
       await axios.get(`${site.routes.reportsFeed.route}/${this.props.match.params.id}/${this.props.match.params.type}`).then((res) => {
        let response = res.data;
        //console.log("data",response) 
        this.setState({
            loading: false,
            data:response
          });
      }).catch((e) => {
             //console.log(e)
          }) 
  };

  _formatXml = (xml) => {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
  
      formatted += new Array(pad + 1).join('  ') + node + '\r\n';
      pad += indent;
    });
  
    return formatted.trim();
  };

  render() {
    return (
      <div className="page-view-snippet">
        {this.state.loading ? (
          <div className="center aligned grid">
            <Loading />
          </div>
        )  : (
          <>
           <div className="text-center">
           
           <span>{this.props.match.params.type=="json"?JSON.stringify(this.state.data, null, 2): (this.state.data)}</span>

            </div>
                

          </>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const connectedComponent = connect(mapStateToProps, null)(FeedDatas);
export { connectedComponent as FeedDatas };

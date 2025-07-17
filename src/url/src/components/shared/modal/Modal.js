import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';

import './Modal.scss';
import { Button } from '../../html/button/Button';

class DialogBox extends Component {
  //State

  state = {
    modalOpen: this.props.modalOpen,
    css: {
      scrolling: this.props.scrolling ? 'scrolling' : '',
      image: this.props.image ? 'image' : '',
      content: this.props.content ? 'content' : '',
    },
  };

  //Render

  render() {
    return (
      <div
        className="cmp-dialog-box"
        style={{
          display: this.props.inline ? 'inline-block' : 'block',
          marginRight: this.props.inline ? '10px' : '',
        }}
      >
        <Modal
          open={this.props.modalOpen}
          onOpen={this.props.onOpen}
          onClose={this.props.onClose}
          trigger={this.props.trigger}
          basic={this.props.basic}
          size={this.props.size}
          dimmer={this.props.dimmer}
          closeOnEscape={this.props.closeOnEscape}
          closeOnDimmerClick={this.props.closeOnDimmerClick}
          closeIcon={this.props.closeIcon}
          centered={this.props.centered}
        >
          {this.props.title ? (
            <div className="header">{this.props.title}</div>
          ) : null}
          <div
            className={`${this.state.css.scrolling} ${this.state.css.image} ${this.state.css.content}`}
          >
            {this.props.description ? (
              <div className="description">{this.props.description}</div>
            ) : null}
            {this.props.children}
          </div>
          {this.props.actions ? (
            <div className="actions">
              {this.props.actions.map((action, key) => {
                return <Button key={key} {...action} />;
              })}
            </div>
          ) : null}
        </Modal>
      </div>
    );
  }
}

DialogBox.defaultProps = {
  basic: false,
  size: 'small',
  centered: true,
  scrolling: false,
  content: true,
  image: false,
  dimmer: undefined,
  closeOnEscape: true,
  closeOnDimmerClick: true,
  closeIcon: true,
  modalOpen: undefined,
};

class ConfirmModal extends Component {
  //Events

  _onClickConfirm = () => {
    this.props.onConfirm();
  };

  _onClickCancel = () => {
    this.props.onCancel();
  };

  render() {
    return (
      <DialogBox
        inline={this.props.inline}
        modalOpen={this.props.modalOpen}
        onClose={this.props.onCancel}
        closeOnDimmerClick={false}
        size={'tiny'}
        title={'Alert!'}
        basic={true}
        description={this.props.description}
        actions={[
          {
            title: 'Cancel',
            size: 'small',
            onClick: this._onClickCancel,
          },
          {
            title: this.props.confirmText || 'Delete',
            size: 'small',
            category: 'brand',
            onClick: this._onClickConfirm,
          },
        ]}
      />
    );
  }
}

export { DialogBox, ConfirmModal };

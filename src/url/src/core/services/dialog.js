import React from 'react';

import swal from 'sweetalert2';

const dialog = {
    confirmation: (title, msg = null) => {
        return swal({
            type: 'warning',
            title: title,
            text: msg,
            confirmButtonColor: '#e00000',
            showCancelButton: true,
            cancelButtonColor: '#d1d1d1'
        });
    },
    infoLoading: (title, msg = null) => {
        return swal({
            type: 'info',
            title: title,
            text: msg,
            allowOutsideClick: false,
            showConfirmButton: false,
            onOpen: () => {
                swal.showLoading()
            }
        })
    },
    successLoading: (title, msg = null) => {
        let timerInterval;
        return swal({
            type: 'success',
            title: title,
            text: msg,
            showConfirmButton: false,
            timer: 2000,
            onOpen: () => {
                timerInterval = setInterval(() => {
                }, 100)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        })
    },
};

export default dialog;
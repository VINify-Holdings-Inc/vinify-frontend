import serviceHandler from '../core/services/serviceHandler';
import store from '../store/createStore';
import { ChangeVideoUploading } from './system';

export async function GetVideos() {
    let res = await serviceHandler.get('user/videos');
    if (res.status === 200)
        return res.body;
}

var AbortController, controller, signal;

export async function Upload(file) {

    store.dispatch(ChangeVideoUploading(true));
    AbortController = window.AbortController;
    controller = new AbortController();
    signal = controller.signal;

    let head = new Headers();
    var data = new FormData();
    data.append(file.name, file);

    let res = await serviceHandler.post('video/upload', data, head, signal);
    store.dispatch(ChangeVideoUploading(false));
    if (res.status === 200)
        return { status: true, videoId: res.body };
    return { status: false };
}


export function AbortFetching() {
    store.dispatch(ChangeVideoUploading(false));
    controller.abort();
}

export async function Delete(id) {

    var res = await serviceHandler.delete('video/' + id);
    return res.status;
}

export async function GetVideo(id) {
    let res = await serviceHandler.get('video/' + id);
    if (res.status === 200)
        return res.body;
}
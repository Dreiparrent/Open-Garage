import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { IUser } from '../../community/community-interfaces';
import { AngularFireStorage } from 'angularfire2/storage';
import { AlertService, Alerts } from '../../alerts/alert.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-image-dialog',
    templateUrl: './image-dialog.component.html',
    styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

    @Input('blah') blah: ElementRef<HTMLInputElement>;
    constructor(public dialogRef: MatDialogRef<ImageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { profile: IUser, need: boolean },
        private fireStore: AngularFirestore, private fireStorage: AngularFireStorage,
        private alertService: AlertService) {
    }

    showProgress = false;
    progress = 0;

    ngOnInit() { }

    imageChange(e) {
        console.log(this.data.profile.ref.id);
        const file = e.target.files[0];
        const storageRef = this.fireStorage.storage.ref(`img/user/${this.data.profile.ref.id}/${file.name}`);
        let snapRef: firebase.storage.Reference;
        const task = storageRef.put(file);
        task.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            snapRef = snapshot.ref;
        }, error => {
            this.alertService.addAlert(Alerts.imageUploadError);
            console.error(error);
        }, () => {
                console.log(snapRef); // TODO: use storage trigger to create reference... also do the colors next
            // this.profile.ref.set({ imgUrl: snapRef. }, {merge: true});
            this.dialogRef.close(true);
        });
    }
    uploadImage() {
        $('#uploader').trigger('click');
    }

}
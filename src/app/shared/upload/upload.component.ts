import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @Input() path: any;
  @Input() meta: any;
  @Input() uploadType: boolean;

  selection: FileList;

  constructor(private UploadService: UploadService) {}

  ngOnInit(): void {}

  detect(event: any) {
    this.selection = event.target.files;
    console.log(this.selection);
  }

  upload() {
    const file = this.selection[0];

    if (file.type.split('/')[0] == 'image') {
      this.UploadService.uploadTask(
        this.path,
        file,
        this.meta,
        this.uploadType
      );
      console.log('hi');
    } else {
      console.log('Images only');
    }
  }
}

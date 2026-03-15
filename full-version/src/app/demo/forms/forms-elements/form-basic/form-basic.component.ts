// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { InfoCircleFill } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-form-basic',
  imports: [CommonModule, SharedModule],
  templateUrl: './form-basic.component.html',
  styleUrls: ['./form-basic.component.scss']
})
export class FormBasicComponent implements OnInit {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[InfoCircleFill]);
  }

  // life cycle event
  ngOnInit() {
    window.addEventListener(
      'load',
      function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
          form.addEventListener(
            'submit',
            function (event: { preventDefault: () => void; stopPropagation: () => void }) {
              if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
              }
              form.classList.add('was-validated');
            },
            false
          );
        });
      },
      false
    );
  }
}

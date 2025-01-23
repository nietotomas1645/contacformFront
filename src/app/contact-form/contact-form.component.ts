import { ChangeDetectorRef, Component } from '@angular/core';
import { LanguageServiceService } from '../services/language-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactFormServiceService } from '../services/contact-form-service.service';
import { ContactForm } from '../models/contact-form.model';
import {  ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {

  languages: any[] = [];
  translations: any = {};
  selectedLanguage: string = 'es';
  activeTabs: number = 0;
  contactForm: FormGroup;
  showModal: boolean = false;
  contactForms: ContactForm[] = [];

  labelText: string = 'Seleccionar';
  fileUploaded: boolean = false;

  constructor(
    private languageService: LanguageServiceService,
    private fb: FormBuilder,
    private contactFormService: ContactFormServiceService,private cd: ChangeDetectorRef,
    private toastr: ToastrService, 
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      comments: ['', [Validators.required]],
      attachment: [null]
    });
  }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.loadTranslations(this.selectedLanguage);
    this.getContactForms();
  }

  loadTranslations(language: string) {
    this.languageService.getTranslations(language).subscribe(
      (translations) => {
        this.translations = translations.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
  
        // Forzar detección de cambios
        this.cd.detectChanges();
      },
      (error) => {
        console.error('Error al cargar las traducciones:', error);
      }
    );
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.target.value;
    this.selectedLanguage = selectedLanguage;
    this.loadTranslations(selectedLanguage);
  }

  showContainer(containerNumber: number) {
    this.activeTabs = containerNumber;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.contactForm.patchValue({
        attachment: file
      });
      this.fileUploaded = true;
    } else {
      this.fileUploaded = false;
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.contactForm.reset();
  }

  confirmSubmit(): void {
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('email', this.contactForm.get('email')?.value);
      formData.append('firstName', this.contactForm.get('firstName')?.value);
      formData.append('lastName', this.contactForm.get('lastName')?.value);
      formData.append('comments', this.contactForm.get('comments')?.value);

      if (this.contactForm.get('attachment')?.value) {
        formData.append('attachment', this.contactForm.get('attachment')?.value);
      }

      this.contactFormService.submitForm(formData).subscribe(
        (response: any) => {
          this.toastr.success('Formulario enviado con éxito', 'Éxito');
          this.closeModal();
        },
        (error: any) => {
          console.error('Error al enviar el formulario', error);
          this.toastr.error('Hubo un error al enviar el formulario', 'Error');
          this.closeModal();
        }
      );
    }
  }

  getContactForms(): void {
    this.contactFormService.getContactForms().subscribe((data: ContactForm[]) => {
      this.contactForms = data;
    });
  }
}

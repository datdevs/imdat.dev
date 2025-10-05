import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiButton, TuiDataList, TuiDialogService, TuiError, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiSelect,
  TuiSwitch,
  TuiTabs,
  TuiTextarea,
  TuiTextareaLimit,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';

import { STATUS_OPTIONS, StatusEnum } from '../../../../core/constants/status';
import { CreatePortfolioRequest } from '../../../../models/portfolio/create-request';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';

@Component({
  selector: 'app-portfolio-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TuiTabs,
    TuiForm,
    TuiLabel,
    TuiError,
    TuiTextfield,
    TuiTextarea,
    TuiTextareaLimit,
    TuiSelect,
    TuiDataList,
    TuiSwitch,
    TuiFieldErrorPipe,
    TuiIcon,
    TuiButton,
    TuiButtonLoading,
  ],
  templateUrl: './portfolio-form.html',
  styleUrl: './portfolio-form.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Field is required',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioForm {
  readonly isSubmitting = signal(false);

  readonly currentTab = signal(0);
  private readonly fb = inject(FormBuilder);
  readonly portfolioForm = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    shortDescription: this.fb.control('', [Validators.required, Validators.minLength(10)]),
    description: this.fb.control('', [Validators.required, Validators.minLength(50)]),
    status: this.fb.control(StatusEnum.DRAFT, [Validators.required]),
    featured: this.fb.control(false),
    technologies: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    features: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    githubUrl: this.fb.control('', [Validators.pattern(/^https?:\/\/github\.com\/.+/)]),
    liveUrl: this.fb.control('', [Validators.pattern(/^https?:\/\/.+/)]),
    images: this.fb.array<FormGroup>([]),
  });

  readonly statusOptions = STATUS_OPTIONS;

  readonly commonTechnologies = [
    'Angular',
    'React',
    'Vue.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'NestJS',
    'MongoDB',
    'PostgreSQL',
    'Firebase',
    'AWS',
    'Docker',
    'Kubernetes',
    'Git',
    'HTML5',
    'CSS3',
    'SCSS',
    'Tailwind CSS',
    'Bootstrap',
    'Material Design',
    'RxJS',
    'NgRx',
    'Jest',
    'Cypress',
  ];

  readonly isFormValid = computed(() => this.portfolioForm.valid);

  readonly imagesArray = this.portfolioForm.get('images') as FormArray<FormGroup>;

  private readonly portfolioStore = inject(PortfolioStore);

  private readonly dialogService = inject(TuiDialogService);
  get technologiesControl() {
    return this.portfolioForm.get('technologies') as FormControl<null | string[]>;
  }

  get featuresControl() {
    return this.portfolioForm.get('features') as FormControl<null | string[]>;
  }

  addImage(): void {
    const imageGroup = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      alt: ['', [Validators.required, Validators.minLength(3)]],
      isMain: [false],
      order: [this.imagesArray.length],
    });

    this.imagesArray.push(imageGroup);
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
    this.updateImageOrders();
  }

  setMainImage(index: number): void {
    this.imagesArray.controls.forEach((control, i) => {
      control.get('isMain')?.setValue(i === index);
    });
  }

  addTechnology(technology: string): void {
    const currentTechnologies = this.technologiesControl.value || [];
    if (!currentTechnologies.includes(technology)) {
      this.technologiesControl.setValue([...currentTechnologies, technology]);
    }
  }

  removeTechnology(technology: string): void {
    const currentTechnologies = this.technologiesControl.value || [];
    this.technologiesControl.setValue(currentTechnologies.filter((t) => t !== technology));
  }

  addFeature(): void {
    const currentFeatures = this.featuresControl.value || [];
    const newFeature = prompt('Enter feature:');
    if (newFeature?.trim()) {
      this.featuresControl.setValue([...currentFeatures, newFeature.trim()]);
    }
  }

  removeFeature(feature: string): void {
    const currentFeatures = this.featuresControl.value || [];
    this.featuresControl.setValue(currentFeatures.filter((f) => f !== feature));
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      this.isSubmitting.set(true);

      const formValue = this.portfolioForm.value;
      const portfolioData: CreatePortfolioRequest = {
        title: formValue.title!,
        shortDescription: formValue.shortDescription!,
        description: formValue.description!,
        status: formValue.status!,
        featured: formValue.featured!,
        technologies: formValue.technologies!,
        features: formValue.features!,
        githubUrl: formValue.githubUrl || undefined,
        liveUrl: formValue.liveUrl || undefined,
        images: this.imagesArray.value.map((img: any) => ({
          url: img.url!,
          alt: img.alt!,
          isMain: img.isMain!,
          order: img.order!,
        })),
        order: 0, // Will be set by the service
      };

      this.portfolioStore.createPortfolio(portfolioData);
      this.isSubmitting.set(false);
      (this.dialogService as any).complete();
    }
  }

  onCancel(): void {
    this.portfolioForm.reset();
    this.imagesArray.clear();
    (this.dialogService as any).complete();
  }

  protected readonly statusStringify: TuiStringHandler<number> = (id) =>
    this.statusOptions.find((item) => item.id === id)?.label ?? '';

  private updateImageOrders(): void {
    this.imagesArray.controls.forEach((control, index) => {
      control.get('order')?.setValue(index);
    });
  }
}

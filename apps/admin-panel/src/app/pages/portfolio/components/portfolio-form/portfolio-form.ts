import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk/classes';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiButton, TuiDataList, TuiDialogService, TuiError, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiChip,
  TuiDataListWrapper,
  TuiElasticContainer,
  TuiFieldErrorPipe,
  TuiFilterByInputPipe,
  TuiHideSelectedPipe,
  TuiInputChip,
  TuiSelect,
  TuiSwitch,
  TuiTabs,
  TuiTextarea,
  TuiTextareaLimit,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';

import { STATUS_OPTIONS, StatusEnum } from '../../../../core/constants/status';
import { Status } from '../../../../models/common';
import { PortfolioImage } from '../../../../models/portfolio';
import { CreatePortfolioRequest } from '../../../../models/portfolio/create-request';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';

@Component({
  selector: 'app-portfolio-form',
  imports: [
    ReactiveFormsModule,
    // Pipes
    AsyncPipe,
    TuiFieldErrorPipe,
    TuiFilterByInputPipe,
    TuiHideSelectedPipe,
    // Taiga UI
    TuiTabs,
    TuiForm,
    TuiLabel,
    TuiError,
    TuiTextfield,
    TuiTextarea,
    TuiTextareaLimit,
    TuiSelect,
    TuiDataList,
    TuiDataListWrapper,
    TuiSwitch,
    TuiIcon,
    TuiButton,
    TuiButtonLoading,
    TuiInputChip,
    TuiChip,
    TuiElasticContainer,
    NgOptimizedImage,
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
export class PortfolioForm implements OnInit {
  protected readonly isSubmitting: WritableSignal<boolean> = signal(false);
  protected readonly currentTab: WritableSignal<number> = signal(0);
  protected readonly isVisibleImageForm: WritableSignal<boolean> = signal(false);
  protected readonly previewImageError: WritableSignal<null | TuiValidationError> = signal(null);

  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    shortDescription: this.fb.control('', [Validators.required, Validators.minLength(10)]),
    description: this.fb.control('', [Validators.required, Validators.minLength(50)]),
    status: this.fb.control(StatusEnum.DRAFT, [Validators.required]),
    featured: this.fb.control(false),
    technologies: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    features: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    githubUrl: this.fb.control('', [Validators.pattern(/^https?:\/\/github\.com\/.+/)]),
    liveUrl: this.fb.control('', [Validators.pattern(/^https?:\/\/.+/)]),
    images: this.fb.control<PortfolioImage[]>([]),
  });

  protected readonly imageFormGroup = this.fb.group({
    url: this.fb.control('', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
    alt: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    isMain: this.fb.control(false),
  });

  protected readonly statusOptions: Status[] = STATUS_OPTIONS;

  protected readonly commonTechnologies: string[] = [
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

  protected readonly isFormValid: Signal<boolean> = computed(() => this.form.valid);

  private readonly destroyRef = inject(DestroyRef);
  private readonly portfolioStore = inject(PortfolioStore);
  private readonly dialogService = inject(TuiDialogService);

  get fc() {
    return {
      images: this.form.get('images') as FormControl<PortfolioImage[]>,
    };
  }

  ngOnInit(): void {
    this.imageFormGroup
      .get('url')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.previewImageError.set(null);
      });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.net/default.png';

    if (!this.imageFormGroup.value.url) {
      this.previewImageError.set(null);
      return;
    }

    this.previewImageError.set(new TuiValidationError('Invalid image URL'));
  }

  addImage(): void {
    this.fc.images.setValue([
      ...this.fc.images.value,
      {
        order: this.fc.images.value.length,
        alt: this.imageFormGroup.value.alt ?? '',
        url: this.imageFormGroup.value.url ?? '',
        isMain: this.imageFormGroup.value.isMain ?? false,
      },
    ]);

    this.imageFormGroup.reset();
    this.isVisibleImageForm.set(false);
  }

  removeImage(imageIndex: number): void {
    this.fc.images.setValue(this.fc.images.value.filter((_, index) => index !== imageIndex));
    this.updateImageOrders();
  }

  cancelImage(): void {
    this.imageFormGroup.reset();
    this.isVisibleImageForm.set(false);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting.set(true);

      const formValue = this.form.value;
      const portfolioData: CreatePortfolioRequest = {
        title: formValue.title!,
        shortDescription: formValue.shortDescription!,
        description: formValue.description!,
        status: formValue.status!,
        featured: formValue.featured!,
        technologies: formValue.technologies!,
        features: formValue.features!,
        githubUrl: formValue.githubUrl ?? undefined,
        liveUrl: formValue.liveUrl ?? undefined,
        images: formValue.images ?? [],
        order: 0, // Will be set by the service
      };

      this.portfolioStore.createPortfolio(portfolioData);
      this.isSubmitting.set(false);
      (this.dialogService as any).complete();
    }
  }

  onCancel(): void {
    this.form.reset();
    (this.dialogService as any).complete();
  }

  protected readonly statusStringify: TuiStringHandler<number> = (id) =>
    this.statusOptions.find((item) => item.id === id)?.label ?? '';

  private updateImageOrders(): void {
    this.fc.images.setValue(this.fc.images.value?.map((img, index) => ({ ...img, order: index })) ?? []);
  }
}

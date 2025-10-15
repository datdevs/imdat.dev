import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk/classes';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiButton, TuiDataList, TuiDialogContext, TuiError, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
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
import { injectContext } from '@taiga-ui/polymorpheus';

import { STATUS_OPTIONS, StatusEnum } from '../../../../core/constants/status';
import { Status } from '../../../../models/common';
import { IPortfolio, PortfolioImage, PortfolioRequestBody } from '../../../../models/portfolio';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';

type IPortfolioForm = Record<keyof PortfolioRequestBody, FormControl<any>>;

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
  public readonly context = injectContext<TuiDialogContext<boolean, IPortfolio | undefined>>();
  protected readonly currentTab: WritableSignal<number> = signal(0);
  protected readonly isVisibleImageForm: WritableSignal<boolean> = signal(false);

  protected readonly previewImageError: WritableSignal<null | TuiValidationError> = signal(null);
  private readonly fb = inject(FormBuilder);

  protected readonly form: FormGroup<IPortfolioForm> = this.fb.group<IPortfolioForm>({
    id: this.fb.control(null),
    title: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
    shortDescription: this.fb.control(null, [Validators.required, Validators.minLength(10)]),
    description: this.fb.control(null, [Validators.required, Validators.minLength(50)]),
    status: this.fb.control(StatusEnum.DRAFT, [Validators.required]),
    featured: this.fb.control(false),
    technologies: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    features: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
    githubUrl: this.fb.control(null, [Validators.pattern(/^https?:\/\/github\.com\/.+/)]),
    liveUrl: this.fb.control(null, [Validators.pattern(/^https?:\/\/.+/)]),
    images: this.fb.control<PortfolioImage[]>([]),
    publishedAt: this.fb.control<Date | null>(null),
  });

  protected readonly imageFormGroup = this.fb.group({
    url: this.fb.control(null, [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
    alt: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
    isMain: this.fb.control(false),
  });

  protected readonly statusOptions: Status<StatusEnum>[] = STATUS_OPTIONS;

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

  private readonly portfolioStore = inject(PortfolioStore);
  protected readonly isSubmitting: Signal<boolean> = this.portfolioStore.isSubmitting;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (this.context.data) {
      this.form.patchValue({ ...this.context.data, publishedAt: this.context?.data?.publishedAt?.toDate() ?? null });
    }
  }

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
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const portfolioData: PortfolioRequestBody = {
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      description: formValue.description,
      status: formValue.status,
      featured: formValue.featured,
      technologies: formValue.technologies,
      features: formValue.features,
      githubUrl: formValue.githubUrl,
      liveUrl: formValue.liveUrl,
      images: formValue.images,
      publishedAt: formValue.status === StatusEnum.DRAFT ? null : (formValue.publishedAt ?? new Date()),
    };

    if (formValue.id) {
      this.portfolioStore.updatePortfolio({ id: formValue.id, payload: portfolioData });
    } else {
      this.portfolioStore.createPortfolio(portfolioData);
    }
  }

  onCancel(): void {
    this.form.reset();
    this.context.completeWith(false);
  }

  protected readonly statusStringify: TuiStringHandler<number> = (id) =>
    this.statusOptions.find((item) => item.id === id)?.label ?? '';

  private updateImageOrders(): void {
    this.fc.images.setValue(this.fc.images.value?.map((img, index) => ({ ...img, order: index })) ?? []);
  }
}

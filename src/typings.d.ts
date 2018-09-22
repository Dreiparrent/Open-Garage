/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
interface JQuery {
    steps(settings?: StepsSettings): JQuery;
    steps(method: 'add', step: StepObject): any;
    steps(method: 'insert', index: number, step: StepObject): any;
    steps(method: 'remove', index: number): boolean;
    steps(method: 'getCurrentStep'): StepObject;
    steps(method: 'getCurrentIndex'): number;
    steps(method: 'getStep', index: number): StepObject;
    steps(method: 'next'): boolean;
    steps(method: 'previous'): boolean;
    steps(method: 'finish'): void;
    steps(method: 'destroy'): void;
    steps(method: 'skip', count: number): boolean;
}
interface StepObjectWizard {
    
}
interface StepObject {
    title: '';
    content: '';
    contentMode: 'html' | 0;
    contentUrl: ''
}
interface StepsSettings {
    /* Appearance */
    headerTag?: string;
    bodyTag?: string;
    contentContainerTag?: string;
    actionContainerTag?: string;
    stepsContainerTag?: string;
    cssClass?: string;
    stepsOrientation?: string | number;

    /* Templates */
    titleTemplate?: string;
    loadingTemplate?: string;

    /* Behaviour */
    autoFocus?: boolean;
    enableAllSteps?: boolean;
    enableKeyNavigation?: boolean;
    enablePagination?: boolean;
    suppressPaginationOnFocus?: boolean;
    enableContentCache?: boolean;
    enableCancelButton?: boolean;
    enableFinishButton?: boolean;
    preloadContent?: boolean;
    showFinishButtonAlways?: boolean;
    forceMoveForward?: boolean;
    saveState?: boolean;
    startIndex?: number;

    /* Transition Effects */
    transitionEffect?: string | number;
    transitionEffectSpeed?: number;

    /* Events */
    onInit?: (event, currentIndex: number) => void | boolean;
    onStepChanging?: (event, currentIndex: number, newIndex: number) => boolean;
    onStepChanged?: (event, currentIndex: number, priorIndex: number) => void;
    onCanceled?: (event) => void | boolean;
    onFinishing?: (event, currentIndex: number) => void | boolean;
    onFinished?: (event, currentIndex: number) => void | boolean;
    onContentLoaded?: (event, currentIndex: number) => void;

    /* Labels */
    labels?: {
        cancel?: string;
        current?: string;
        pagination?: string;
        finish?: string;
        next?: string;
        previous?: string;
        loading?: string;
    }
}
interface CarouselElement {
    moveTo: (n: number) => void;
}
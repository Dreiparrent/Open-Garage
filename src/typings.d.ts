/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
interface JQuery {
    steps(settings?: StepsSettings): JQuery;
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
    onInit?: (event, currentIndex) => void | boolean;
    onStepChanging?: (event, currentIndex, newIndex) => boolean;
    onStepChanged?: (event, currentIndex, priorIndex) => void;
    onCanceled?: (event) => void | boolean;
    onFinishing?: (event, currentIndex) => void | boolean;
    onFinished?: (event, currentIndex) => void | boolean;
    onContentLoaded?: (event, currentIndex) => void;

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
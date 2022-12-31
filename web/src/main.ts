import Aurelia from 'aurelia';
import {RouterConfiguration} from '@aurelia/router';
import {ValidationHtmlConfiguration} from '@aurelia/validation-html';
import {FormatDate} from './utils/value-converters/format-date';
import {App} from './app';

Aurelia.register(
	ValidationHtmlConfiguration,
	RouterConfiguration.customize({useUrlFragmentHash: false, useHref: false}),
	FormatDate
)
.app(App)
.start();
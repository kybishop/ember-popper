import Application from '../app';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import registerRAFWaiter from 'ember-raf-scheduler/test-support/register-waiter';

registerRAFWaiter();
setApplication(Application.create({ autoboot: false }));

start();

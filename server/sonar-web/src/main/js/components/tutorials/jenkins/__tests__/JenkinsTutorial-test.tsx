/*
 * SonarQube
 * Copyright (C) 2009-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import {
  mockProjectAlmBindingResponse,
  mockProjectBitbucketBindingGet
} from '../../../../helpers/mocks/alm-settings';
import { mockComponent } from '../../../../helpers/testMocks';
import BitbucketWebhookStep from '../BitbucketWebhookStep';
import JenkinsfileStep from '../JenkinsfileStep';
import JenkinsTutorial, { JenkinsTutorialProps } from '../JenkinsTutorial';
import MultiBranchPipelineStep from '../MultiBranchPipelineStep';
import PreRequisitesStep from '../PreRequisitesStep';

it('should render correctly', () => {
  expect(shallowRender()).toMatchSnapshot('default');
  expect(shallowRender({ projectBinding: mockProjectAlmBindingResponse() })).toMatchSnapshot(
    'not Bitbucket binding'
  );
});

it('should correctly navigate between steps', () => {
  const wrapper = shallowRender();

  expect(wrapper.find(PreRequisitesStep).prop('open')).toBe(true);
  expect(wrapper.find(MultiBranchPipelineStep).prop('open')).toBe(false);
  expect(wrapper.find(BitbucketWebhookStep).prop('open')).toBe(false);
  expect(wrapper.find(JenkinsfileStep).prop('open')).toBe(false);

  // Pre-reqs done.
  wrapper.find(PreRequisitesStep).prop('onDone')();
  expect(wrapper.find(PreRequisitesStep).prop('open')).toBe(false);
  expect(wrapper.find(MultiBranchPipelineStep).prop('open')).toBe(true);
  expect(wrapper.find(BitbucketWebhookStep).prop('open')).toBe(false);
  expect(wrapper.find(JenkinsfileStep).prop('open')).toBe(false);

  // Multibranch done.
  wrapper.find(MultiBranchPipelineStep).prop('onDone')();
  expect(wrapper.find(PreRequisitesStep).prop('open')).toBe(false);
  expect(wrapper.find(MultiBranchPipelineStep).prop('open')).toBe(false);
  expect(wrapper.find(BitbucketWebhookStep).prop('open')).toBe(true);
  expect(wrapper.find(JenkinsfileStep).prop('open')).toBe(false);

  // Webhook done.
  wrapper.find(BitbucketWebhookStep).prop('onDone')();
  expect(wrapper.find(PreRequisitesStep).prop('open')).toBe(false);
  expect(wrapper.find(MultiBranchPipelineStep).prop('open')).toBe(false);
  expect(wrapper.find(BitbucketWebhookStep).prop('open')).toBe(false);
  expect(wrapper.find(JenkinsfileStep).prop('open')).toBe(true);

  // Open Pre-reqs.
  wrapper.find(PreRequisitesStep).prop('onOpen')();
  expect(wrapper.find(PreRequisitesStep).prop('open')).toBe(true);

  // Open Multibranch.
  wrapper.find(MultiBranchPipelineStep).prop('onOpen')();
  expect(wrapper.find(MultiBranchPipelineStep).prop('open')).toBe(true);

  // Open Webhook.
  wrapper.find(BitbucketWebhookStep).prop('onOpen')();
  expect(wrapper.find(BitbucketWebhookStep).prop('open')).toBe(true);
});

function shallowRender(props: Partial<JenkinsTutorialProps> = {}) {
  return shallow<JenkinsTutorialProps>(
    <JenkinsTutorial
      component={mockComponent()}
      projectBinding={mockProjectBitbucketBindingGet()}
      {...props}
    />
  );
}
import { assert } from '~utils/assert';

function findFormContainer(): HTMLDivElement {
  const form = document.querySelector('form');

  assert(form, 'Unable to locate google form html element');

  const { nextSibling } = form;

  assert(nextSibling, 'Unable to locate google icon bar');

  return nextSibling as HTMLDivElement;
}

export function createGoogleComShadowRootForBell(): ShadowRoot {
  const maxZIndexForContent = Math.pow(2, 31) - 2;
  const container = findFormContainer();

  const containerWrapper = document.createElement('div');

  containerWrapper.style.display = 'flex';
  containerWrapper.style.alignItems = 'center';

  const containerWrapperLeftSide = document.createElement('div');

  containerWrapperLeftSide.style.position = 'relative';
  containerWrapperLeftSide.style.zIndex = String(maxZIndexForContent);
  containerWrapperLeftSide.setAttribute(
    'data-testid',
    'giveFreely-bell-notifications',
  );

  const shadowRoot = containerWrapperLeftSide.attachShadow({ mode: 'open' });

  const containerParent = container.parentElement;

  assert(containerParent, 'Unable to locate container html parentElement');

  containerParent.removeChild(container);
  containerParent.appendChild(containerWrapper);

  containerWrapper.append(containerWrapperLeftSide);

  const containerWrapperRightSide = document.createElement('div');

  containerWrapperRightSide.append(container);
  containerWrapper.append(containerWrapperRightSide);

  return shadowRoot;
}

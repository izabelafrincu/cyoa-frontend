import React from 'react';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create chapters for your story';
}

function getDescription () {
  return (
    <>
      <p>You can group your sequences into chapters to manage them more easily.</p>
      <p>The name of the chapter will appear when the player reads a sequence belonging to that chapter. If the sequence is not assigned to a chapter, the story name will be shown instead.</p>
      <p>A chapter can have any number of sub chapters, but the depth of sub chapters cannot go beyond 2.</p>
    </>
  );
}

export function renderChaptersListTitle () {
  return (
    <HelpCmp text="Chapters" title={getTitle()} description={getDescription()}/>
  );
}

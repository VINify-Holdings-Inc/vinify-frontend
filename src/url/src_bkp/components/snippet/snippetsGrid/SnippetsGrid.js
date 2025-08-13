import React from 'react';

import { SnippetGridItem } from '../';

const SnippetsGrid = (props) => {
    return (
        <div className='mt-4 text-center'>
            <ul className='snippets-view list-inline'>
                {
                    (props.snippets != null && props.snippets.length > 0) ?
                        props.snippets.map((snippet, key) => {
                            return <SnippetGridItem key={key} id={snippet.snippetId} title={snippet.title} link={snippet.campaignUrl} status={snippet.status} width={snippet.width} />
                        })
                        : null
                }
            </ul>
        </div>
    )
}

export { SnippetsGrid };
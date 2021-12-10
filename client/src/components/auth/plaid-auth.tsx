import React, { useCallback, useEffect, useState } from 'react';

import { usePlaidLink } from 'react-plaid-link';

export const PlaidAuth = () => {
    const [publicToken, setPublicToken] = useState('')
    const fetchLinkToken = async () => {
        const response = await fetch('http://localhost:9000/create_link_token')
        const { link_token } = await response.json()
        setPublicToken(link_token)
    }
    
    useEffect(() => {
        fetchLinkToken()
    }, [])

    const onSuccess = useCallback(
        (public_token, metadata) => {
            console.log('onSuccess', public_token, metadata)
            fetch('http://localhost:9000/plaid_token_exchange',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_token })
            })
        },
        []
    );

    const onEvent = useCallback(
        (eventName, metadata) => console.log('onEvent', eventName, metadata),
        []
    );

    const onExit = useCallback(
        (err, metadata) => console.log('onExit', err, metadata),
        []
    );
    const config = {
        token: publicToken,
        onSuccess,
        onEvent,
        onExit,
    // –– optional parameters
    // receivedRedirectUri: props.receivedRedirectUri || null,
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <>
      <button
        type="button"
        className="button"
        onClick={() => open()}
      >
        Open Plaid Link
      </button>
    </>
  );
};


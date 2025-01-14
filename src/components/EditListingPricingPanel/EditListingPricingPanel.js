import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './EditListingPricingPanel.module.css';

const { Money } = sdkTypes;

const EditListingPricingPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { price, publicData } = currentListing.attributes;
  const cleaningFee = publicData && publicData.cleaningFee ? publicData.cleaningFee : null;
  const parkingFee = publicData && publicData.parkingFee ? publicData.parkingFee : null;
  const securityFee = publicData && publicData.securityFee ? publicData.securityFee : null;
  const largeShootFee = publicData && publicData.largeShootFee ? publicData.largeShootFee : null;
  const overtimeFee = publicData && publicData.overtimeFee ? publicData.overtimeFee : null;

  const cleaningFeeAsMoney = cleaningFee ? new Money(cleaningFee.amount, cleaningFee.currency) : null;
  const parkingFeeAsMoney = parkingFee ? new Money(parkingFee.amount, parkingFee.currency) : null;
  const securityFeeAsMoney = securityFee ? new Money(securityFee.amount, securityFee.currency) : null;
  const largeShootFeeAsMoney = largeShootFee ? new Money(largeShootFee.amount, largeShootFee.currency) : null;
  const overtimeFeeAsMoney = overtimeFee ? new Money(overtimeFee.amount, overtimeFee.currency) : null;

  const initialValues = { price, cleaningFee: cleaningFeeAsMoney, parkingFee: parkingFeeAsMoney, securityFee: securityFeeAsMoney, largeShootFee: largeShootFeeAsMoney, overtimeFee: overtimeFeeAsMoney };

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  );

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;
  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={initialValues}
      onSubmit={values => {
        const { price, parkingFee = null, cleaningFee = null, securityFee = null, largeShootFee = null, overtimeFee = null } = values;

        const updatedValues = {
          price,
          publicData: {
            cleaningFee: cleaningFee ? { amount: cleaningFee.amount, currency: cleaningFee.currency } : null,
            parkingFee: parkingFee ? { amount: parkingFee.amount, currency: parkingFee.currency } : null,
            securityFee: securityFee ? { amount: securityFee.amount, currency: securityFee.currency } : null,
            largeShootFee: largeShootFee ? { amount: largeShootFee.amount, currency: largeShootFee.currency } : null,
            overtimeFee: overtimeFee ? { amount: overtimeFee.amount, currency: overtimeFee.currency } : null,
          },
        };
        onSubmit(updatedValues);

      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
      currentListing={currentListing}
    />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingPricingPanel;

export type Locale = 'fr' | 'en';

export const messages: Record<Locale, Record<string, string>> = {
  fr: {
    cta_explore: "Découvrir",
    price_from: "à partir de",
    home_title: "Explore Cameroun",
    // Common
    common_processing: 'Traitement...',
    common_pay: 'Payer',
    placeholder_email: 'vous@exemple.com',

    // Zones / Checkout select
    checkout_language_label: 'Langue / Language:',
    checkout_origin_label: 'Votre pays ou zone de provenance',
    zone_cameroon: 'Cameroun',
    zone_other_africa: "Autre pays d'Afrique",
    zone_europe: 'Europe',
    zone_us_canada: 'États-Unis / Canada',

    // Checkout page
    checkout_payment_title: 'Paiement',
    checkout_recap: 'Récapitulatif',
    checkout_total: 'Total',
    checkout_contact: 'Contact',
    checkout_details_title: 'Coordonnées & Paiement',
    checkout_email_confirmation: 'Email de confirmation',
    checkout_pay_method: 'Moyen de paiement',
    pay_mtn: 'MTN Mobile Money',
    pay_orange: 'Orange Money',
    pay_card: 'Carte bancaire',

    // Pay MTN
    pay_mtn_title: 'Paiement MTN Mobile Money',
    label_phone_mtn: 'Numéro MTN',
    help_phone_mtn: 'Saisissez votre numéro MTN Mobile Money exact.',
    error_phone_invalid: 'Le numéro doit contenir 9 chiffres.',
    label_amount_xaf: 'Montant (XAF)',
    help_amount_cart: 'Vérifiez le montant total de votre panier avant de valider.',
    confirm_title: 'Confirmer le paiement',
    operator_label: 'Opérateur :',
    phone_label: 'Téléphone :',
    amount_label: 'Montant :',
    confirm_explainer_mtn: "En cliquant sur « Confirmer », vous serez redirigé vers la page sécurisée de l’opérateur pour valider le paiement avec votre code secret.",
    btn_cancel: 'Annuler',
    btn_confirm: 'Confirmer',

    // Pay Orange
    pay_orange_title: 'Paiement Orange Money',
    label_phone_orange: 'Numéro Orange',
    help_phone_orange: 'Saisissez votre numéro Orange Money exact.',
    confirm_explainer_orange: "En cliquant sur « Confirmer », vous serez redirigé vers la page sécurisée de l’opérateur pour valider le paiement avec votre code secret.",

    // Pay Card
    pay_card_title: 'Paiement par Carte',
    label_email: 'Email',
    error_email_invalid: 'Adresse email invalide.',
    label_card_number: 'Numéro de carte',
    help_card_number: 'Entrez le numéro de votre carte tel qu’affiché.',
    error_card_number: 'Numéro de carte invalide.',
    label_card_expiry: 'Expiration',
    help_card_expiry: 'Format d’expiration: mois/année (ex. 08/27).',
    error_card_expiry: 'Format MM/AA requis.',
    label_card_cvc: 'CVC',
    help_card_cvc: 'Code à 3 chiffres au dos de la carte.',
    error_card_cvc: 'CVC invalide.',
    help_amount_enter: 'Saisissez le montant en XAF que vous souhaitez payer.',
    method_label: 'Méthode :',
    email_label: 'Email :',
    confirm_explainer_card: "En cliquant sur « Confirmer », vous serez redirigé vers la page sécurisée du prestataire pour valider le paiement avec votre banque.",
  },
  en: {
    cta_explore: "Discover",
    price_from: "from",
    home_title: "Explore Cameroon",
    // Common
    common_processing: 'Processing...',
    common_pay: 'Pay',
    placeholder_email: 'you@example.com',

    // Zones / Checkout select
    checkout_language_label: 'Langue / Language:',
    checkout_origin_label: 'Your country of origin',
    zone_cameroon: 'Cameroon',
    zone_other_africa: 'Other African country',
    zone_europe: 'Europe',
    zone_us_canada: 'United States / Canada',

    // Checkout page
    checkout_payment_title: 'Checkout',
    checkout_recap: 'Summary',
    checkout_total: 'Total',
    checkout_contact: 'Contact',
    checkout_details_title: 'Contact & Payment',
    checkout_email_confirmation: 'Confirmation email',
    checkout_pay_method: 'Payment method',
    pay_mtn: 'MTN Mobile Money',
    pay_orange: 'Orange Money',
    pay_card: 'Credit card',

    // Pay MTN
    pay_mtn_title: 'MTN Mobile Money Payment',
    label_phone_mtn: 'MTN Number',
    help_phone_mtn: 'Enter your exact MTN Mobile Money number.',
    error_phone_invalid: 'The phone number must have 9 digits.',
    label_amount_xaf: 'Amount (XAF)',
    help_amount_cart: 'Verify the cart total before confirming.',
    confirm_title: 'Confirm payment',
    operator_label: 'Operator:',
    phone_label: 'Phone:',
    amount_label: 'Amount:',
    confirm_explainer_mtn: 'By clicking “Confirm”, you will be redirected to the secure operator page to validate the payment with your secret code.',
    btn_cancel: 'Cancel',
    btn_confirm: 'Confirm',

    // Pay Orange
    pay_orange_title: 'Orange Money Payment',
    label_phone_orange: 'Orange Number',
    help_phone_orange: 'Enter your exact Orange Money number.',
    confirm_explainer_orange: 'By clicking “Confirm”, you will be redirected to the secure operator page to validate the payment with your secret code.',

    // Pay Card
    pay_card_title: 'Card Payment',
    label_email: 'Email',
    error_email_invalid: 'Invalid email address.',
    label_card_number: 'Card number',
    help_card_number: 'Enter your card number as displayed.',
    error_card_number: 'Invalid card number.',
    label_card_expiry: 'Expiry',
    help_card_expiry: 'Expiry format: month/year (e.g., 08/27).',
    error_card_expiry: 'MM/YY format required.',
    label_card_cvc: 'CVC',
    help_card_cvc: '3-digit code on the back of the card.',
    error_card_cvc: 'Invalid CVC.',
    help_amount_enter: 'Enter the amount in XAF you want to pay.',
    method_label: 'Method:',
    email_label: 'Email:',
    confirm_explainer_card: 'By clicking “Confirm”, you will be redirected to the secure provider page to validate the payment with your bank.',
  },
};




#!/bin/bash

if [ -z "$BACK_OFFICE_BASE_PATH" ]
then
	echo "Using default BACK_OFFICE_BASE_PATH"
	sed -i s^@back_office_base_path@^https://back-office.csn.dev.sedona.fr:444^g /var/www/csn/main*.js*
else
	echo "Replacing default BACK_OFFICE_BASE_PATH with ${BACK_OFFICE_BASE_PATH}"
	sed -i s^@back_office_base_path@^${BACK_OFFICE_BASE_PATH}^g /var/www/csn/main*.js*
fi

if [ -z "$NOTACCESS_BASE_PATH" ]
then
	echo "Using default NOTACCESS_BASE_PATH"
	sed -i s^@notaccess_base_path@^https://rec-notaccess.notaires.fr^g /var/www/csn/main*.js*
else
	echo "Replacing default NOTACCESS_BASE_PATH with ${NOTACCESS_BASE_PATH}"
	sed -i s^@notaccess_base_path@^${NOTACCESS_BASE_PATH}^g /var/www/csn/main*.js*
fi

if [ -z "$MONCOMPTE_BASE_PATH" ]
then
	echo "Using default MONCOMPTE_BASE_PATH"
	sed -i s^@moncompte_base_path@^https://qual-moncompte.idnot.fr^g /var/www/csn/main*.js*
else
	echo "Replacing default MONCOMPTE_BASE_PATH with ${MONCOMPTE_BASE_PATH}"
	sed -i s^@moncompte_base_path@^${MONCOMPTE_BASE_PATH}^g /var/www/csn/main*.js*
fi

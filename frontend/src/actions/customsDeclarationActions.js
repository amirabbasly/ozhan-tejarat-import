// src/actions/customsDeclarationActions.js

import axiosInstance from '../utils/axiosInstance';
import {
    FETCH_DECLARATIONS_REQUEST,
    FETCH_DECLARATIONS_SUCCESS,
    FETCH_DECLARATIONS_FAILURE,
    FETCH_DECLARATION_DETAILS_REQUEST,
    FETCH_DECLARATION_DETAILS_SUCCESS,
    FETCH_DECLARATION_DETAILS_FAILURE,
    FETCH_GOODS_REQUEST,
    FETCH_GOODS_SUCCESS,
    FETCH_GOODS_FAILURE,
    FETCH_CUSTOMS_DUTY_REQUEST,
    FETCH_CUSTOMS_DUTY_SUCCESS,
    FETCH_CUSTOMS_DUTY_FAILURE,
    SAVE_DATA_REQUEST,
    SAVE_DATA_SUCCESS,
    SAVE_DATA_FAILURE,
    SAVE_MULTIPLE_DECLARATIONS_REQUEST,
    SAVE_MULTIPLE_DECLARATIONS_SUCCESS,
    SAVE_MULTIPLE_DECLARATIONS_FAILURE,
    SAVE_MULTIPLE_DECLARATIONS_PROGRESS,
} from './actionTypes';

// Synchronous Action Creators
export const fetchDeclarationsRequest = () => ({
    type: FETCH_DECLARATIONS_REQUEST,
});

export const fetchDeclarationsSuccess = (declarations) => ({
    type: FETCH_DECLARATIONS_SUCCESS,
    payload: declarations,
});

export const fetchDeclarationsFailure = (error) => ({
    type: FETCH_DECLARATIONS_FAILURE,
    payload: error,
});

// Fetch Declaration Details Actions
export const fetchDeclarationDetailsRequest = () => ({
    type: FETCH_DECLARATION_DETAILS_REQUEST,
});

export const fetchDeclarationDetailsSuccess = (declarationDetails) => ({
    type: FETCH_DECLARATION_DETAILS_SUCCESS,
    payload: declarationDetails,
});

export const fetchDeclarationDetailsFailure = (error) => ({
    type: FETCH_DECLARATION_DETAILS_FAILURE,
    payload: error,
});

// Fetch Goods Actions
export const fetchGoodsRequest = () => ({
    type: FETCH_GOODS_REQUEST,
});

export const fetchGoodsSuccess = (goods) => ({
    type: FETCH_GOODS_SUCCESS,
    payload: goods,
});

export const fetchGoodsFailure = (error) => ({
    type: FETCH_GOODS_FAILURE,
    payload: error,
});

// Fetch Customs Duty Info Actions
export const fetchCustomsDutyRequest = (ggsVcodeInt) => ({
    type: FETCH_CUSTOMS_DUTY_REQUEST,
    payload: ggsVcodeInt,
});

export const fetchCustomsDutySuccess = (ggsVcodeInt, dutyInfo) => ({
    type: FETCH_CUSTOMS_DUTY_SUCCESS,
    payload: { ggsVcodeInt, dutyInfo },
});

export const fetchCustomsDutyFailure = (ggsVcodeInt, error) => ({
    type: FETCH_CUSTOMS_DUTY_FAILURE,
    payload: { ggsVcodeInt, error },
});

// Save Data Actions
export const saveDataRequest = () => ({
    type: SAVE_DATA_REQUEST,
});

export const saveDataSuccess = (message) => ({
    type: SAVE_DATA_SUCCESS,
    payload: message,
});

export const saveDataFailure = (error) => ({
    type: SAVE_DATA_FAILURE,
    payload: error,
});

// Save Multiple Declarations Actions
export const saveMultipleDeclarationsRequest = () => ({
    type: SAVE_MULTIPLE_DECLARATIONS_REQUEST,
});

export const saveMultipleDeclarationsSuccess = (data) => ({
    type: SAVE_MULTIPLE_DECLARATIONS_SUCCESS,
    payload: data,
});

export const saveMultipleDeclarationsFailure = (error) => ({
    type: SAVE_MULTIPLE_DECLARATIONS_FAILURE,
    payload: error,
});

export const saveMultipleDeclarationsProgress = (current, total) => ({
    type: SAVE_MULTIPLE_DECLARATIONS_PROGRESS,
    payload: { current, total },
});

// Asynchronous Action Creators

// Fetch Declarations
export const fetchDeclarations = (ssdsshGUID, urlVCodeInt, pageSize) => async (dispatch) => {
    dispatch(fetchDeclarationsRequest());
    const payload = {
        ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
        PageSize: parseInt(pageSize, 10),
    };

    try {
        const response = await axiosInstance.post('customs-declarations/', payload);

        if (response.data.ErrorCode === 0) {
            const declarations = Array.isArray(response.data.CustomizeCustomsDeclarationList)
                ? response.data.CustomizeCustomsDeclarationList
                : [];
            dispatch(fetchDeclarationsSuccess(declarations));
        } else {
            const errorMessage = response.data.ErrorDesc || 'An error occurred.';
            dispatch(fetchDeclarationsFailure(errorMessage));
        }
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || error.response.data
                : 'Failed to connect to the server.';
        dispatch(fetchDeclarationsFailure(errorMsg));
    }
};

// Fetch Declaration Details
export const fetchDeclarationDetails = (FullSerialNumber, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch(fetchDeclarationDetailsRequest());
    const payload = {
        DeclarationType: 0,
        FullSerilaNumber: FullSerialNumber,
        ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
        const response = await axiosInstance.post('customs-green-declaration/', payload);

        if (response.data.ErrorCode === 0) {
            dispatch(fetchDeclarationDetailsSuccess(response.data.GreenCustomsDeclaration));
        } else {
            dispatch(fetchDeclarationDetailsFailure(response.data.ErrorDesc || 'An error occurred.'));
        }
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || error.response.data
                : 'Failed to connect to the server.';
        dispatch(fetchDeclarationDetailsFailure(errorMsg));
    }
};

// Fetch Goods
export const fetchGoods = (gcuVcodeInt, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch(fetchGoodsRequest());
    const payload = {
        gcuVcodeInt,
        ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
        const response = await axiosInstance.post('fetch-goods/', payload);

        if (response.data.ErrorCode === 0) {
            const goods = Array.isArray(response.data.GreenCustomsDeclarationGoodList)
                ? response.data.GreenCustomsDeclarationGoodList.map((good) => ({
                      ...good,
                      import_rights: 0,
                      red_cersent: 0,
                      added_value: 0,
                      discount: 0,
                      customs_value: 0,
                  }))
                : [];
            dispatch(fetchGoodsSuccess(goods));
        } else {
            dispatch(fetchGoodsFailure(response.data.ErrorDesc || 'An error occurred.'));
        }
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || error.response.data
                : 'Failed to connect to the server.';
        dispatch(fetchGoodsFailure(errorMsg));
    }
};

// Fetch Customs Duty Information
export const fetchCustomsDutyInformation = (ggsVcodeInt, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch(fetchCustomsDutyRequest(ggsVcodeInt));
    const payload = {
        ggsVcodeInt,
        ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
        const response = await axiosInstance.post('fetch-customs-duty-info/', payload);

        if (response.data.ErrorCode === 0) {
            const fetchedDutyInfo = response.data.GreenCustomsDutyInformationList || [];
            const dutyInfo = {
                import_rights: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '041')?.cintaxesAmount || 0,
                customs_value: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '041')?.cintaxesBase || 0,
                red_cersent: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '042')?.cintaxesAmount || 0,
                added_value: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '047')?.cintaxesAmount || 0,
                discount: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '049')?.cintaxesAmount || 0,
            };
            dispatch(fetchCustomsDutySuccess(ggsVcodeInt, dutyInfo));
            return dutyInfo;
        } else {
            dispatch(
                fetchCustomsDutyFailure(ggsVcodeInt, response.data.ErrorDesc || 'An error occurred.')
            );
        }
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || error.response.data
                : 'Failed to connect to the server.';
        dispatch(fetchCustomsDutyFailure(ggsVcodeInt, errorMsg));
    }
};

// Save Data
export const saveData = (declaration, goods, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch(saveDataRequest());

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formattedCottageDate = formatDate(declaration.gcuassessmentDateSH);

    const cottagePayload = {
        cottage_number: declaration.gcucustomsDeclarationSerialNumber,
        proforma_number: declaration.OrderRegistrationNumber,
        cottage_date: formattedCottageDate,
        total_value: declaration.gcutotalCurrencyValue,
        quantity: declaration.gcucommodityItemQuantity,
    };

    try {
        // Save the Cottage
        const cottageResponse = await axiosInstance.post('save-cottage/', cottagePayload);

        console.log('Cottage saved:', cottageResponse.data);

        // Fetch and update duty info for all goods
        const updatedGoodsPromises = goods.map(async (good) => {
            const payload = {
                ggsVcodeInt: good.ggsVcodeInt,
                ssdsshGUID,
                urlVCodeInt: parseInt(urlVCodeInt, 10),
            };

            console.log('Sending payload to fetch-customs-duty-info:', payload);

            const response = await axiosInstance.post('fetch-customs-duty-info/', payload);

            if (response.data.ErrorCode === 0) {
                const fetchedDutyInfo = response.data.GreenCustomsDutyInformationList || [];
                return {
                    ...good,
                    import_rights: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '041')?.cintaxesAmount || 0,
                    customs_value: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '041')?.cintaxesBase || 0,
                    red_cersent: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '042')?.cintaxesAmount || 0,
                    added_value: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '047')?.cintaxesAmount || 0,
                    discount: fetchedDutyInfo.find((duty) => duty.cintaxesCode === '049')?.cintaxesAmount || 0,
                };
            } else {
                console.error('Error from fetch-customs-duty-info API:', response.data.ErrorDesc);
                return good;
            }
        });

        const updatedGoods = await Promise.all(updatedGoodsPromises);

        console.log('Updated Goods with Duty Info:', updatedGoods);

        // Prepare goods payload with updated duty info
        const goodsPayload = {
            cottage_number: declaration.gcucustomsDeclarationSerialNumber,
            goods: updatedGoods.map((good) => ({
                ggsVcodeInt: good.ggsVcodeInt,
                ggscommodityItemNumber: good.ggscommodityItemNumber,
                ggscommodityDescription: good.ggscommodityDescription,
                total_value: good.ggscommodityItemCurrencyValue,
                import_rights: good.import_rights || 0,
                customs_value: good.customs_value || 0,
                red_cersent: good.red_cersent || 0,
                added_value: good.added_value || 0,
                discount: good.discount || 0,
                quantity: good.ggspackageCount,
            })),
        };

        console.log('Goods Payload:', goodsPayload);

        // Save the Goods
        const goodsResponse = await axiosInstance.post('save-cottage-goods/', goodsPayload);

        dispatch(
            saveDataSuccess(
                goodsResponse.data.message || 'Goods and cottage saved successfully.'
            )
        );
    } catch (error) {
        console.error('Error during save operation:', error);

        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || JSON.stringify(error.response.data)
                : 'Error saving data.';

        dispatch(saveDataFailure(errorMsg));
    }
};

// Save Multiple Declarations
export const saveMultipleDeclarations = (declarations, ssdsshGUID, urlVCodeInt) => async (dispatch, getState) => {
    dispatch(saveMultipleDeclarationsRequest());

    let failedDeclarations = [];
    let savedCount = 0;

    try {
        for (const [index, declaration] of declarations.entries()) {
            try {
                // Fetch declaration details
                await dispatch(fetchDeclarationDetails(declaration.FullSerialNumber, ssdsshGUID, urlVCodeInt));

                const { declarationDetails } = getState().customsDeclarations;

                // Fetch goods for the declaration
                await dispatch(fetchGoods(declarationDetails.gcuVcodeInt, ssdsshGUID, urlVCodeInt));

                const { goods } = getState().customsDeclarations;

                // Save data to the database
                await dispatch(saveData(declarationDetails, goods, ssdsshGUID, urlVCodeInt));

                savedCount++;
            } catch (error) {
                failedDeclarations.push(declaration.FullSerialNumber);
                console.error(`Error saving declaration: ${declaration.FullSerialNumber}`, error);
            }

            // Dispatch progress update
            dispatch(saveMultipleDeclarationsProgress(index + 1, declarations.length));
        }

        // Finalize with success or partial success
        if (failedDeclarations.length > 0) {
            dispatch(
                saveMultipleDeclarationsSuccess({
                    message: `${savedCount}/${declarations.length} declarations saved successfully.`,
                    failedDeclarations,
                })
            );
        } else {
            dispatch(
                saveMultipleDeclarationsSuccess({
                    message: 'All declarations saved successfully.',
                })
            );
        }
    } catch (error) {
        console.error('Error during bulk save:', error);
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.ErrorDesc || JSON.stringify(error.response.data)
                : 'Error saving declarations.';
        dispatch(saveMultipleDeclarationsFailure(errorMsg));
    }
};

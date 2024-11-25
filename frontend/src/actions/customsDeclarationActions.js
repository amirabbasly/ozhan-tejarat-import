  // src/actions/customsDeclarationActions.js

  import axios from 'axios';
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
  export const saveMultipleDeclarationsRequest = () => ({
    type: SAVE_MULTIPLE_DECLARATIONS_REQUEST,
  });
  
  export const saveMultipleDeclarationsSuccess = (message) => ({
    type: SAVE_MULTIPLE_DECLARATIONS_SUCCESS,
    payload: message,
  });
  
  export const saveMultipleDeclarationsFailure = (error) => ({
    type: SAVE_MULTIPLE_DECLARATIONS_FAILURE,
    payload: error,
  });

  
  
  // Asynchronous Action Creator (Thunk)
  export const fetchDeclarations = (ssdsshGUID, urlVCodeInt, pageSize) => {
    return async (dispatch) => {
      dispatch(fetchDeclarationsRequest());
      try {
        const payload = {
          ssdsshGUID: ssdsshGUID,
          urlVCodeInt: parseInt(urlVCodeInt, 10),
          PageSize: parseInt(pageSize, 10),
        };
        const response = await axios.post(
          'http://127.0.0.1:8000/api/customs-declarations/',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.ErrorCode === 0) {
          // Normalize or process data if needed
          const declarations = Array.isArray(response.data.CustomizeCustomsDeclarationList)
            ? response.data.CustomizeCustomsDeclarationList
            : Array.isArray(response.data)
            ? response.data
            : [];
          dispatch(fetchDeclarationsSuccess(declarations));
        } else {
          dispatch(fetchDeclarationsFailure(response.data.ErrorDesc || 'خطایی رخ داده است.'));
        }
      } catch (error) {
        const errorMsg =
          error.response && error.response.data
            ? error.response.data
            : 'خطا در برقراری ارتباط با سرور.';
        dispatch(fetchDeclarationsFailure(errorMsg));
      }
    };
  };
  export const fetchDeclarationDetails = (FullSerialNumber, ssdsshGUID, urlVCodeInt) => {
    return async (dispatch) => {
      dispatch(fetchDeclarationDetailsRequest());
      const payload = {
        DeclarationType: 0,
        FullSerilaNumber: FullSerialNumber,
        ssdsshGUID: ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
      };
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/customs-green-declaration/',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.ErrorCode === 0) {
          dispatch(fetchDeclarationDetailsSuccess(response.data.GreenCustomsDeclaration));
        } else {
          dispatch(fetchDeclarationDetailsFailure(response.data.ErrorDesc || 'خطایی رخ داده است.'));
        }
      } catch (error) {
        const errorMsg =
          error.response && error.response.data
            ? error.response.data.ErrorDesc || error.response.data
            : 'خطا در برقراری ارتباط با سرور.';
        dispatch(fetchDeclarationDetailsFailure(errorMsg));
      }
    };
  };

  // Fetch Goods
  export const fetchGoods = (gcuVcodeInt, ssdsshGUID, urlVCodeInt) => {
    return async (dispatch) => {
      dispatch(fetchGoodsRequest());
      const payload = {
        gcuVcodeInt: gcuVcodeInt,
        ssdsshGUID: ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
      };
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/fetch-goods/',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
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
          dispatch(fetchGoodsFailure(response.data.ErrorDesc || 'خطایی رخ داده است.'));
        }
      } catch (error) {
        const errorMsg =
          error.response && error.response.data
            ? error.response.data.ErrorDesc || error.response.data
            : 'خطا در برقراری ارتباط با سرور.';
        dispatch(fetchGoodsFailure(errorMsg));
      }
    };
  };

  // Fetch Customs Duty Information for a Good
  export const fetchCustomsDutyInformation = (ggsVcodeInt, ssdsshGUID, urlVCodeInt) => {
    return async (dispatch) => {
      dispatch(fetchCustomsDutyRequest(ggsVcodeInt));
      const payload = {
        ggsVcodeInt: ggsVcodeInt,
        ssdsshGUID: ssdsshGUID,
        urlVCodeInt: parseInt(urlVCodeInt, 10),
      };
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/fetch-customs-duty-info/',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
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
          dispatch(fetchCustomsDutyFailure(ggsVcodeInt, response.data.ErrorDesc || 'خطایی رخ داده است.'));
        }
      } catch (error) {
        const errorMsg =
          error.response && error.response.data
            ? error.response.data.ErrorDesc || error.response.data
            : 'خطا در برقراری ارتباط با سرور.';
        dispatch(fetchCustomsDutyFailure(ggsVcodeInt, errorMsg));
      }
    };
  };
  
  export const saveData = (declaration, goods, ssdsshGUID, urlVCodeInt) => {
    return async (dispatch) => {
      if (!ssdsshGUID || !urlVCodeInt) {
        console.error('Missing ssdsshGUID or urlVCodeInt:', { ssdsshGUID, urlVCodeInt });
        throw new Error('Required parameters ssdsshGUID or urlVCodeInt are missing.');
      }
  
      dispatch({ type: 'SAVE_DATA_REQUEST' });
  
      const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
  
      const formattedCottageDate = formatDate(declaration.gcucustomsDeclarationRegistrationDate);
  
      const cottagePayload = {
        cottage_number: declaration.gcucustomsDeclarationSerialNumber,
        proforma_number: declaration.OrderRegistrationNumber,
        cottage_date: formattedCottageDate,
        total_value: declaration.gcutotalCurrencyValue,
        quantity: declaration.gcucommodityItemQuantity,
      };
  
      try {
        // Save the Cottage
        const cottageResponse = await axios.post(
          'http://127.0.0.1:8000/api/save-cottage/',
          cottagePayload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
  
        console.log('Cottage saved:', cottageResponse.data);
  
        // Fetch and update duty info for all goods
        const updatedGoodsPromises = goods.map(async (good) => {
          const payload = {
            ggsVcodeInt: good.ggsVcodeInt,
            ssdsshGUID,
            urlVCodeInt: parseInt(urlVCodeInt, 10),
          };
  
          console.log('Sending payload to fetch-customs-duty-info:', payload);
  
          const response = await axios.post(
            'http://127.0.0.1:8000/api/fetch-customs-duty-info/',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
          );
  
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
        const goodsResponse = await axios.post(
          'http://127.0.0.1:8000/api/save-cottage-goods/',
          goodsPayload,
          { headers: { 'Content-Type': 'application/json' } }
        );
  
        dispatch({
          type: 'SAVE_DATA_SUCCESS',
          payload: goodsResponse.data.message || 'کالاها و کوتاژ با موفقیت ذخیره شدند.',
        });
      } catch (error) {
        console.error('Error during save operation:', error);
  
        const errorMsg =
          error.response && error.response.data
            ? error.response.data.ErrorDesc || JSON.stringify(error.response.data)
            : 'خطا در ذخیره اطلاعات.';
  
        dispatch({ type: 'SAVE_DATA_FAILURE', payload: errorMsg });
      }
    };
  };
  export const saveMultipleDeclarations = (declarations, ssdsshGUID, urlVCodeInt) => {
    return async (dispatch, getState) => {
      dispatch(saveMultipleDeclarationsRequest());
  
      try {
        // Loop through declarations and save each one
        for (const declaration of declarations) {
          // Fetch declaration details
          await dispatch(
            fetchDeclarationDetails(declaration.FullSerialNumber, ssdsshGUID, urlVCodeInt)
          );
  
          // Get the latest state after fetching declaration details
          const { declarationDetails } = getState().customsDeclarations;
  
          // Fetch goods for the declaration
          await dispatch(
            fetchGoods(declarationDetails.gcuVcodeInt, ssdsshGUID, urlVCodeInt)
          );
  
          // Get the latest state after fetching goods
          const { goods } = getState().customsDeclarations;
  
          // Save data to the database
          await dispatch(saveData(declarationDetails, goods, ssdsshGUID, urlVCodeInt));
        }
  
        dispatch(saveMultipleDeclarationsSuccess('اظهارنامه‌ها با موفقیت ذخیره شدند.'));
      } catch (error) {
        console.error('Error during bulk save:', error);
        const errorMsg =
          error.response && error.response.data
            ? error.response.data.ErrorDesc || JSON.stringify(error.response.data)
            : 'خطا در ذخیره اظهارنامه‌ها.';
        dispatch(saveMultipleDeclarationsFailure(errorMsg));
      }
    };
  };
  
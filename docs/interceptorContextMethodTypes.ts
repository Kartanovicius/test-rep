/**
 * Default API functions which are available in each intercepted method.
 *
 * @example
 * ```
 * // The API can be obtained from the parameters of intercepted method
 * // This will be triggered when a user opens an existing Quote
 * export const quotesDetailOpen = async ({ api }) => {
 *   api.notify.success('Hello World!');
 * }
 * ```
 */
export interface InterceptorMethodAPI {
  /**
   * Used for obtaining data from Unity which are not accessible through configuration
   */
  app: {
    /**
     * Returns logged user
     */
    getCurrentUser: () => Promise<any>;
  };

  configuration: {
    /**
     * Reads values from Pricefx configuration object.<br>
     * You can use it to get values from feature flags or some other values such as:
     * - type - dev | prod
     * - partition
     * - applicationEnvironment - standalone | salesforce | c4c | dynamics | sugarCRM
     * - apiUrl
     * - locale
     * @param path - The path to the value, for example `environmentSettings.salesforce.displayLocation.Aura.autoGrow`.
     * @param defaultValue - The default value if the value under `path` is not defined.
     * @example
     *
     * const visibleDashboards = await configuration.retrieveConfig(
     *  'customerSpecificFeatureFlag.dashboards.visible.account',
     *   []
     * );
     */
    retrieveConfig: (path: string, defaultValue?: any) => Promise<any>;

    /**
     * Used to **temporarily** set a value in the configuration.<br>
     * Updated configuration is valid only in the current web browser tab.
     * @param path - The path to the value, for example `environmentSettings.salesforce.displayLocation.Aura.autoGrow`.
     * @param value
     */
    overrideConfig: (path: string, value: any) => Promise<void>;
  };

  /**
   * crmManager enables communication with CRMs in which Pricefx is embedded.
   */
  crmManager: {
    /**
     * Returns a value of the `accountAssociatedValue` feature flag.<br>
     * The value is set when the application starts and contains a value from CRM account entity.<br>
     * The feature flag `accountAssociationField` will determine which value is used.<br>
     * The result is based on CRM which is used with Pricefx.
     *
     * For `"applicationEnvironment": "salesforce"` it will return the value from<br>
     *  - `salesforce.accountAssociatedValue`
     *
     * For `"applicationEnvironment":"c4c"` it will return the value from<br>
     *  - `c4c.accountAssociatedValue`
     *
     * Similarly for other CRMs:<br>
     *  - `dynamics.accountAssociatedValue`<br>
     *  - `sugarCRM.accountAssociatedValue`
     */
    getAccountAssociatedValue: () => Promise<any>;

    /**
     * Returns CRM payload. The value of the payload will vary based on CRM which is used with Pricefx.
     *
     * @example
     *
     * // Get payload from CRM and fill in data from it to a Quote
     * export const quotesDetailNew = async ({
     *   quoteAPI,
     *   api: { crmManager }
     * }) => {
     *   const payload = await crmManager.getPayload();
     *   // you can use developer tools and key word:
     *   // debugger;
     *   // to observe what is in payload
     *   await quoteAPI.setHeaderValue('label', payload.Name);
     *   await quoteAPI.setHeaderInputValue('Customer', payload.Customer_Number__c);
     *   await quoteAPI.setHeaderInputValue('ProjectID', payload.Project_Id__c);
     *   await quoteAPI.setHeaderInputValue('ProjectName', payload.Project__c);
     * };
     */
    getPayload: () => Promise<any>;

    /**
     * Will return true when Pricefx is embedded under an account page in CRM.
     */
    isAccountPage: () => Promise<boolean>;

    getCurrentUser: () => Promise<any>;

    /**
     * Will return Account from CRM with provided ID.
     */
    findAccount: () => Promise<any>;

    /**
     * Will return true when Pricefx is embedded under the opportunity page in CRM.
     */
    isOpportunityPage: () => Promise<boolean>;

    /**
     * Returns a value of the `accountAssociationField` feature flag.<br>
     * The result is based on CRM which is used with Pricefx.
     *
     * For `"applicationEnvironment": "salesforce"` it will return the value from<br>
     *  - `salesforce.accountAssociationField`
     *
     * For `"applicationEnvironment":"c4c"` it will return the value from<br>
     *  - `c4c.accountAssociationField`
     *
     * Similarly for other CRMs:<br>
     *  - `dynamics.accountAssociationField`<br>
     *  - `sugarCRM.accountAssociationField`
     */
    getAccountAssociationField: () => Promise<string>;

    /**
     * Returns a value of the `opportunityAssociatedValue` feature flag.<br>
     * The value is set when the application starts and contains a value from CRM opportunity entity.<br>
     * The feature flag `opportunityAssociationField` will determine which value is used.<br>
     * The result is based on CRM which is used with Pricefx.
     *
     * For `"applicationEnvironment": "salesforce"` it will return the value from<br>
     *  - `salesforce.opportunityAssociatedValue`
     *
     * For `"applicationEnvironment":"c4c"` it will return the value from<br>
     *  - `c4c.opportunityAssociatedValue`
     *
     * Similarly for other CRMs:<br>
     *  - `dynamics.opportunityAssociatedValue`<br>
     *  - `sugarCRM.opportunityAssociatedValue`
     */
    getOpportunityAssociatedValue: () => Promise<any>;

    /**
     * Returns a link to the opportunity with provided ID.<br>
     * **Salesforce only**, this has not been implemented yet in other CRMs.
     * @param externalId ID of the opportunity which you want to link.
     */
    getOpportunityURL: (externalId: string) => Promise<string>;

    /**
     * Returns a link to the opportunity line items with provided ID.<br>
     * **Salesforce only**, this has not been implemented yet in other CRMs.
     * @param externalId ID of the opportunity which you want to link.
     */
    getOpportunityLineItemURL: (externalId: string) => Promise<string>;

    /**
     * Returns a link of the SObject.<br>
     * **Salesforce only**, this has not been implemented yet in other CRMs.
     */
    getSObjectURL: () => Promise<string>;

    /**
     * Calls HTTP request in CRM.<br>
     * **Salesforce, SugarCRM only**, this has not been implemented yet in other CRMs.
     *
     * @param url
     * @param method - HTTP request methods
     * @param payload
     * @example
     *
     * // Updating opportunity back in Salesforce
     * export const quotesDetailSubmit = async ({
     *   quoteAPI,
     *   api: { crmManager, notify }
     * }) => {
     *   const externalRef = await quoteAPI.getHeaderValue('externalRef');
     *   const opportunityUrl = await crmManager.getOpportunityURL(externalRef);
     *   const totalValue = await quoteAPI.getHeaderOutputResult('TotalAmount');
     *   const payloadForSF = {
     *     PriceFx_Quote_No__c: quoteAPI.getHeaderValue('uniqueName'),
     *     Amount: totalValue
     *   };
     *   crmManager.postCall(opportunityUrl, 'PATCH', payloadForSF).then(() => {
     *     notify.success('Opportunity was updated.');
     *   });
     * };
     */
    postCall: (url: string, method: string, payload: any) => Promise<any>;

    /**
     * Finds opportunities by SQL.<br>
     * **Salesforce only**, this has not been implemented yet in other CRMs.
     * @param query
     * @example
     *
     * ````
     * export const crmFindOpportunitiesPre = ({
     *   result,
     *   searchText,
     *   api: { crmManager }
     * }) => {
     *   const query = `
     *               SELECT Id, Name, StageName, RecordType.Name
     *               FROM Opportunity
     *               WHERE Name LIKE '%${searchText}%' LIMIT 300`;
     *   return crmManager.findOpportunitiesByQuery(query).then(list => {
     *     list.forEach(item => {
     *       item.Name = `${item.Name} (${item.RecordType.Name})`;
     *     });
     *     result.list = list;
     *     return result;
     *   });
     * };
     * ````
     * @deprecated
     */
    findOpportunitiesByQuery: (query: string) => Promise<any>;

    /**
     * Finds opportunities by SQL query.<br>
     * Supported keywords `SELECT`, `FROM`, `WHERE`, `AND`, and `OR`.<br>
     * Supported operators for *Salesforce*, *C4C* and *Dynamics* : `=`, `!=`, `<`, `>`, `<=`, `>=`.<br>
     * Supported operators for *SugarCRM* : `=`.
     * @param query
     * @example
     *
     * ````
     * export const crmFindOpportunitiesPre = ({
     *   result,
     *   searchText,
     *   api: { crmManager }
     * }) => {
     *   const query = `
     *               SELECT Id, Name, StageName, RecordType.Name
     *               FROM Opportunity
     *               WHERE Name = '%${searchText}%'`;
     *   return crmManager.findByQuery(query).then(list => {
     *     list.forEach(item => {
     *       item.Name = `${item.Name} (${item.RecordType.Name})`;
     *     });
     *     result.list = list;
     *     return result;
     *   });
     * };
     * ````
     */
    findByQuery: (query: string) => Promise<any>;

    /**
     * Loads an entity by ID from the module.<br>
     * **SugarCRM only**
     * @param module
     * @param id
     * @example
     *
     * const parentAccount = await crmManager.getSugarCrmEntityById('Accounts', parentId);
     *
     */
    getSugarCrmEntityById: (module: string, id: string) => Promise<any>;

    /**
     * This method is deprecated, use getAccountAssociationField instead.
     * Returns a value of the `quoteAccountReferenceField` feature flag.<br>
     * The result is based on CRM which is used with Pricefx.
     *
     * For `"applicationEnvironment": "salesforce"` it will return the value from<br>
     *  - `salesforce.quoteAccountReferenceField`
     *
     * For `"applicationEnvironment":"c4c"` it will return the value from<br>
     *  - `c4c.quoteAccountReferenceField`
     *
     * Similarly for other CRMs:<br>
     *  - `dynamics.quoteAccountReferenceField`<br>
     *  - `sugarCRM.quoteAccountReferenceField`
     *
     * @deprecated
     */
    getQuoteAccountReferenceField: () => Promise<string>;

    /**
     * Sends a number of quotes back to SugarCRM.<br>
     * It shows this number as a part of the panel name. Currently, users may experience some issues.
     * **SugarCRM only**
     * @deprecated
     */
    reportOpportunityNumberOfQuotes: () => Promise<void>;

    /**
     * This function is used to manipulate _initCache in SugarcrmManager.
     * It is mainly used to modify the parent account under the account page in SugarCRM
     * **SugarCRM only**
     * @param path
     * @param data
     *
     * @example
     *
     * // Data is a parent account for the current account
     * crmManager.updateCache('sugarCRMData.payload.Account', data)
     */
    updateCache: (path: string, data: any) => Promise<void>;

    /**
     * Triggers postMessage with a message in the window with CRM.
     * @param message
     *
     * @example
     * const message = {
     *   fields: [
     *     { id: 'name', value: 'New name' },
     *     { id: 'description', value: 'New description' }
     *   ]
     * };
     * return crmManager.callAndReceive({ action: 'createNewQuote', data: message })
     */
    callAndReceive: (message: any) => Promise<any>;
  };
}

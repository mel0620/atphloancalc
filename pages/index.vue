<template>
    <div>
        <v-container>
            <v-form ref="form" class="mb-4"
                v-model="valid"
                lazy-validation
            >
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field
                            v-model="unitDetails"
                            label="Unit Details"
                            outlined
                            placeholder="Year Model/Make/Variant"
                            hide-details
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-combobox
                            v-model="bank"
                            :items="['JACCS','Security Bank','Eastwest','Maybank','Malayan Bank', 'LDB', 'Brand New','Motorcycle']"
                            prepend-inner-icon="mdi-bank"
                            label="Financing"
                            placeholder="Select Bank/Financing Company"
                            outlined
                            :rules="rules"
                            hide-details
                            class="mt-3"
                        ></v-combobox>
                    </v-col>
                    <v-col cols="12">
                        <v-row v-if="isJackUp" dense>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="origPrice"
                                    label="Original Price"
                                    outlined
                                    placeholder="0.00"
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="jackUpPrice"
                                    label="Additional"
                                    outlined
                                    placeholder="0.00"
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-combobox
                                    v-model="jackUpAF"
                                    :items="[50,55,60,65,70]"
                                    prepend-inner-icon="mdi-percent"
                                    label="Amount Financed"
                                    placeholder="0%"
                                    outlined
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-row v-else dense>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="unitPrice"
                                    label="Unit Price"
                                    outlined
                                    placeholder="0.00"
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="isCustom">
                                <v-text-field
                                    v-model="dpCustom"
                                    label="Down Payment"
                                    placeholder="0.00"
                                    outlined
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" v-else>
                                <v-combobox
                                    v-model="downPaymentSelect"
                                    :items="downPaymentSelectItems"
                                    prepend-inner-icon="mdi-percent"
                                    label="Down Payment"
                                    placeholder="0%"
                                    outlined
                                    :rules="rules"
                                    type="number"
                                    hide-details
                                    class="mt-3"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">

                    </v-col>
                </v-row>
                
                <div class="d-flex justify-end">
                    <v-switch
                        v-model="isCustom"
                        label="Custom D.P"
                        color="green"
                        v-if="!isJackUp"
                    ></v-switch>
                    <v-switch
                        v-if="bank != 'Brand New'"
                        v-model="isJackUp"
                        label="Jack-up"
                        color="green"
                        class="ml-3"
                    ></v-switch>
                </div>

                <v-row>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            v-model="chattel"
                            label="Chattel Mortgage Fee"
                            outlined
                            hide-details
                            placeholder="0.00"
                            append-icon="mdi-table"
                            type="number"
                            @click:append="showReferenceDialog = true"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            v-model="insurance"
                            label="Insurance with AOG"
                            outlined
                            hide-details
                            placeholder="0.00"
                            append-icon="mdi-table"
                            type="number"
                            @click:append="showReferenceDialog = true"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            v-model="others"
                            label="Others/Transfer"
                            outlined
                            hide-details
                            placeholder="0.00"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
            <v-row>
                <v-col cols="12" v-if="isJackUp">
                    <v-btn @click="computeJackUp()" depressed color="primary" block>
                        Compute
                    </v-btn>
                    <v-btn @click="clear()" class="mt-3" depressed block>
                        Clear
                    </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                    <v-btn v-if="isCustom" @click="computeCustom()" depressed color="primary" block>
                        Compute
                    </v-btn>
                    <v-btn v-else @click="compute()" depressed color="primary" block>
                        Compute
                    </v-btn>
                    <v-btn @click="clear()" class="mt-3" depressed block>
                        Clear
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="isResultDialog" width="500">
            <v-card>
                <v-card-title class="text-h5 primary white--text">
                    Sample Quotation
                </v-card-title>

                <v-card-text>
                    <div v-if="isJackUp" class="result mt-3">
                        <div><h3>{{ unitDetails }}</h3></div>
                        <div><b>Original Price:</b> {{ formatPrice(origPrice) }}</div>
                        <div><b>Jack-up Price:</b> {{ formatPrice(jackUpPriceTotal) }}</div>
                        <div><b>Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                        <div><b>Amount Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                        <!-- <div><b>Terms:</b></div> -->
                        <div><b>12 Months:</b> {{ formatPrice(oneYear) }}</div>
                        <div><b>24 Months Term:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months Term:</b> {{ formatPrice(threeYears) }}</div>
                        <div><b>48 Months Term:</b> {{ formatPrice(fourYears) }}</div>
                        <blockquote v-if="chattel == 0 && insurance == 0" class="blockquote pa-0">
                            <footer>
                                <small>
                                    <em>* {{ note }}</em>
                                </small>
                            </footer>
                        </blockquote>
                        <div v-if="chattel != 0"><b>Chattel:</b> {{ formatPrice(chattel) }} Estimated only</div>
                        <div v-if="insurance != 0"><b>Insurance:</b> {{ formatPrice(insurance) }} Estimated only</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text" v-if="chattel != 0 && insurance != 0">ESTIMATED CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
                    </div>
                    <div v-else class="result mt-3">
                        <div><h3>{{ unitDetails }}</h3></div>
                        <div><b>Unit Price:</b> {{ formatPrice(unitPrice) }}</div>
                        <div><b><span v-if="!isJackUp && !isCustom">{{ downPaymentSelect }}%</span> Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                        <div><b><span v-if="!isJackUp && !isCustom">{{ amountFinancedPercent }}%</span> Amount Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                        <!-- <div><b>Terms:</b></div> -->
                        <div v-if="bank != 'Brand New' && bank != 'Eastwest' && bank != 'LDB'"><b>12 Months Term:</b> {{ formatPrice(oneYear) }}</div>
                        <div v-if="bank == 'Maybank'"><b>18 Months Term:</b> {{ formatPrice(eighteenMonths) }}</div>
                        <div><b>24 Months Term:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months Term:</b> {{ formatPrice(threeYears) }}</div>
                        <div v-if="bank != 'Motorcycle'"><b>48 Months Term:</b> {{ formatPrice(fourYears) }}</div>
                        <div v-if="bank == 'Brand New'"><b>60 Months Term:</b> {{ formatPrice(fiveYears) }}</div>
                        <blockquote v-if="chattel == 0 && insurance == 0 && bank != 'Brand New'" class="blockquote pa-0">
                            <footer>
                                <small>
                                    <em>* {{ note }}</em>
                                </small>
                            </footer>
                        </blockquote>
                        <div v-if="chattel != 0"><b>Chattel:</b> {{ formatPrice(chattel) }} Estimated only</div>
                        <div v-if="insurance != 0"><b>Insurance:</b> {{ formatPrice(insurance) }} Estimated only</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text" v-if="chattel != 0 && insurance != 0">ESTIMATED CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed color="primary" @click="isResultDialog = false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showReferenceDialog" fullscreen hide-overlay transition="dialog-bottom-transition" >
            <v-card>
                <v-toolbar dark color="primary" elevation="3" dense class="border-radius-none">
                    <v-toolbar-title >Chattel and Insurance Estimate</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="showReferenceDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-sheet
					id="scrolling-techniques-7"
                    class="overflow-y-auto bg-light"
                    max-height="700"
				>
                    <div class="pa-3">
                        <v-data-table
                            title="CMF and Insurance Estimate"
                            :headers="headers"
                            :items="estimates"
                            :items-per-page="5"
                            class="elevation-1 mt-4"
                        ></v-data-table>
                    </div>
                </v-sheet>
                <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="primary"
                        @click="showReferenceDialog = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions> -->
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
  data: () => ({
    isResultDialog: false,
    isCustom: false,
    showReferenceDialog: false,
    bank: 'JACCS',
    note: 'In addition to the Down Payment, you will also be required to pay for the Chattel Mortgage and Comprehensive Insurance (with Acts of Nature coverage)',

    isJackUp: false,
    origPrice: null,
    jackUpPrice: null,
    jackUpPriceTotal: null,
    jackUpAF: null,

    valid: true,
    rules: [
      value => !!value || 'Required.',
    ],
    unitDetails: '',
    unitPrice: null,
    chattel: 0,
    insurance: 0,
    others: 0,
    totalEstCashout: null,
    dpCustom: null,
    downPayment: null,
    downPaymentSelect: null,
    downPaymentSelectItems: [20,25,30,35,40,45,50,55,60],

    // rates are multipliers for the amount financed (e.g. 1.3395) per term (months)
    rates: {
      'JACCS'        : { 12: 1.1373, 24: 1.3395, 36: 1.4494, 48: 1.5729 },
      'Security Bank': { 12: 1.1280, 24: 1.3260, 36: 1.4273, 48: 1.5426 },
      'Eastwest'     : { 24: 1.3383, 36: 1.4351, 48: 1.5363 },                           //12: 1.1280
      'Maybank'      : { 12: 1.1400, 18: 1.1950, 24: 1.3395, 36: 1.4475, 48: 1.5750 },
      'Malayan Bank' : { 12: 1.1302, 24: 1.3236, 36: 1.4172, 48: 1.5216 },
      'LDB'          : { 24: 1.3236, 36: 1.4172, 48: 1.5216 },
      'Brand New'    : { 24: 1.2626, 36: 1.3291, 48: 1.4011, 60: 1.4872 },
      'Motorcycle'   : { 12: 1.1607, 24: 1.3180, 36: 1.4317 }
    },

    amountFinancedPercent: null,
    amountFinanced: null,
    // oneYear is still used in template for Motorcycle and others so keep it
    oneYear: null,
    eighteenMonths: null,
    twoYears: null,
    threeYears: null,
    fourYears: null,
    fiveYears: null,

    headers: [
      {
        text: 'Amount Financed',
        align: 'start',
        value: 'af',
      },
      { text: 'CMF', align: 'start', value: 'cmf' },
      { text: 'Insurance with AOG', align: 'start', value: 'ins' },
    ],
    estimates: [
      { af: '300K - 450K', cmf: '24,000', ins: '29,000' },
      { af: '490K', cmf: '25,000', ins: '30,000' },
      { af: '500K', cmf: '27,000', ins: '32,000' },
      { af: '750K - 800K', cmf: '30,000', ins: '35,000' },
      { af: '1.1M', cmf: '40,000', ins: '38,000' },
    ],
  }),
  methods: {
    // helper to apply rate multipliers if they exist for the bank
    applyRates(amount) {
      // zero or falsy amount => skip
      if (!amount) return;

      const bankRates = this.rates[this.bank] || {};

      // for each possible term set the corresponding property if rate exists
      if (bankRates[12] !== undefined) {
        this.oneYear = amount * bankRates[12] / 12;
      } else {
        this.oneYear = null;
      }

      if (bankRates[18] !== undefined) {
        this.eighteenMonths = amount * bankRates[18] / 18;
      } else {
        this.eighteenMonths = null;
      }

      if (bankRates[24] !== undefined) {
        this.twoYears = amount * bankRates[24] / 24;
      } else {
        this.twoYears = null;
      }

      if (bankRates[36] !== undefined) {
        this.threeYears = amount * bankRates[36] / 36;
      } else {
        this.threeYears = null;
      }

      if (bankRates[48] !== undefined) {
        this.fourYears = amount * bankRates[48] / 48;
      } else {
        this.fourYears = null;
      }

      if (bankRates[60] !== undefined) {
        this.fiveYears = amount * bankRates[60] / 60;
      } else {
        this.fiveYears = null;
      }
    },

    compute() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isResultDialog = true;

      // ensure numeric math (avoid .toFixed returning string)
      const dpPercent = Number(this.downPaymentSelect) / 100;
      this.downPayment = Number(this.unitPrice) * dpPercent;

      this.amountFinancedPercent = 100 - Number(this.downPaymentSelect);

      this.amountFinanced = Number(this.unitPrice) - Number(this.downPayment);

      // apply centralized rates
      this.applyRates(this.amountFinanced);

      // normalize cashout inputs
      let downpayment = this.downPayment || 0;
      let chattel = this.chattel || 0;
      let insurance = this.insurance || 0;
      let others = this.others || 0;

      this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);
    },

    computeCustom() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isResultDialog = true;

      this.downPayment = Number(this.dpCustom) || 0;

      this.amountFinanced = Number(this.unitPrice) - Number(this.downPayment);

      // use same central rates
      this.applyRates(this.amountFinanced);

      let downpayment = this.downPayment || 0;
      let chattel = this.chattel || 0;
      let insurance = this.insurance || 0;
      let others = this.others || 0;

      this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);
    },

    computeJackUp() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isResultDialog = true;

      const origprice = Number(this.origPrice) || 0;
      const jackupprice = Number(this.jackUpPrice) || 0;

      this.jackUpPriceTotal = origprice + jackupprice;

      // ensure numeric percent
      const afPercent = Number(this.jackUpAF) / 100 || 0;
      this.amountFinanced = this.jackUpPriceTotal * afPercent;

      // It looked like downPayment was original price minus amountFinanced in your code
      this.downPayment = origprice - this.amountFinanced;

      // apply rates for jack-up — JACCS-like default in original logic; we'll use selected bank's rates
      this.applyRates(this.amountFinanced);

      let downpayment = this.downPayment || 0;
      let chattel = this.chattel || 0;
      let insurance = this.insurance || 0;
      let others = this.others || 0;

      this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);
    },

    clear() {
      this.$refs.form.resetValidation();
      this.unitDetails = '';
      this.unitPrice = 0;
      this.origPrice = 0;
      this.jackUpPrice = 0;
      this.dpCustom = 0;
      this.chattel = 0;
      this.insurance = 0;
      this.others = 0;
    },

    formatPrice(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0
      });
      return formatter.format(Math.round(value));
    },
  }
}
</script>

<style lang="scss">
.result {
    background-color: #fff;
    // border: 1px solid rgba(#000, .1);
    padding: 1rem;
}
</style>

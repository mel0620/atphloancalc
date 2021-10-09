<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-form ref="form"
                        v-model="valid"
                        lazy-validation
                    >
                        <v-text-field
                            v-model="unitDetails"
                            label="Unit Details"
                            outlined
                            placeholder="Year Model/Make/Variant"
                            hide-details
                        ></v-text-field>
                        <div v-if="isJockUp">
                            <v-row dense>
                                <v-col cols="12" md="6" sm="6">
                                    <v-text-field
                                        v-model="origPrice"
                                        label="Original Price"
                                        outlined
                                        placeholder="0.00"
                                        :rules="rules"
                                        hide-details
                                        class="mt-3"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" sm="6">
                                    <v-text-field
                                        v-model="jockUpPrice"
                                        label="Jock-up Price"
                                        outlined
                                        placeholder="0.00"
                                        :rules="rules"
                                        hide-details
                                        class="mt-3"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else>
                            <v-text-field
                                v-model="unitPrice"
                                label="Unit Price"
                                outlined
                                placeholder="0.00"
                                :rules="rules"
                                hide-details
                                class="mt-3"
                            ></v-text-field>
                            <v-text-field
                                v-if="isCustom"
                                v-model="dpCustom"
                                label="Down Payment"
                                placeholder="0.00"
                                outlined
                                :rules="rules"
                                hide-details
                                class="mt-3"
                            ></v-text-field>
                            <v-combobox
                                v-else
                                v-model="downPaymentSelect"
                                :items="downPaymentSelectItems"
                                prepend-inner-icon="mdi-percent"
                                label="Down Payment"
                                placeholder="0%"
                                outlined
                                :rules="rules"
                                hide-details
                                class="mt-3"
                            ></v-combobox>
                        </div>
                        <div class="d-flex justify-end">
                            <v-switch
                                v-model="isCustom"
                                label="Custom D.P"
                                color="green"
                                v-if="!isJockUp"
                            ></v-switch>
                            <v-switch
                                v-model="isJockUp"
                                label="Jock-up"
                                color="green"
                                class="ml-3"
                            ></v-switch>
                        </div>
                        <v-text-field
                            v-model="chattel"
                            label="Chattel Mortgage Fee"
                            outlined
                            placeholder="0.00"
                        ></v-text-field>
                        <v-text-field
                            v-model="insurance"
                            label="Insurance with AOG"
                            outlined
                            placeholder="0.00"
                        ></v-text-field>
                        <v-text-field
                            v-model="others"
                            label="Others"
                            outlined
                            placeholder="0.00"
                        ></v-text-field>
                    </v-form>
                    <v-row>
                        <v-col cols="12" v-if="isJockUp">
                            <v-btn @click="computeJockUp()" depressed color="primary" block>
                                Compute
                            </v-btn>
                        </v-col>
                        <v-col cols="12" v-else>
                            <v-btn v-if="isCustom" @click="computeCustom()" depressed color="primary" block>
                                Compute
                            </v-btn>
                            <v-btn v-else @click="compute()" depressed color="primary" block>
                                Compute
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="isResultDialog" width="500">
            <v-card>
                <v-card-title class="text-h5 primary white--text">
                    Sample Quotation
                </v-card-title>

                <v-card-text>
                    <div v-if="isJockUp" class="result mt-3">
                        <div><h3>{{ unitDetails }}</h3></div>
                        <div><b>Original Price:</b> {{ formatPrice(origPrice) }}</div>
                        <div><b>Jock-up Price:</b> {{ formatPrice(jockUpPrice) }}</div>
                        <div><b>Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                        <div><b>Amount Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                        <div><b>Terms:</b></div>
                        <div><b>12 Months:</b> {{ formatPrice(oneYear) }}</div>
                        <div><b>24 Months:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months:</b> {{ formatPrice(threeYears) }}</div>
                        <div><b>48 Months:</b> {{ formatPrice(fourYears) }}</div>
                        <div v-if="chattel != 0"><b>CMF:</b> {{ formatPrice(chattel) }}</div>
                        <div v-if="insurance != 0"><b>Insurance with AOG:</b> {{ formatPrice(insurance) }}</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text">TOTAL CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
                    </div>
                    <div v-else class="result mt-3">
                        <div><h3>{{ unitDetails }}</h3></div>
                        <div><b>Unit Price:</b> {{ formatPrice(unitPrice) }}</div>
                        <div><b><span v-if="!isJockUp && !isCustom">{{ downPaymentSelect }}%</span> Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                        <div><b><span v-if="!isJockUp && !isCustom">{{ amountFinancedPercent }}%</span> Amount Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                        <div><b>Terms:</b></div>
                        <div><b>12 Months:</b> {{ formatPrice(oneYear) }}</div>
                        <div><b>24 Months:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months:</b> {{ formatPrice(threeYears) }}</div>
                        <div><b>48 Months:</b> {{ formatPrice(fourYears) }}</div>
                        <div v-if="chattel != 0"><b>CMF:</b> {{ formatPrice(chattel) }}</div>
                        <div v-if="insurance != 0"><b>Insurance with AOG:</b> {{ formatPrice(insurance) }}</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text">TOTAL CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="primary"
                        @click="isResultDialog = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data: () => ({
        isResultDialog: false,
        isCustom: false,

        isJockUp: false,
        origPrice: null,
        jockUpPrice: null,

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
        banks: [
            { jaccs: ['1.1285','1.3260','1.4290','1.5440'] }
        ],
        amountFinancedPercent: null,
        amountFinanced: null,
        terms: '',
        oneYear: null,
        twoYears: null,
        threeYears: null,
        fourYears: null,
    }),
    methods: {
        compute() {

            if (!this.$refs.form.validate()) {
                return;
            }

            this.isResultDialog = true;

            // let dp = 0;

            // if (this.downPaymentSelect == 20) 
            // {
            //     dp = 0.20
            // } else if (this.downPaymentSelect == 25) {
            //     dp = 0.25
            // } else if (this.downPaymentSelect == 30) {
            //     dp = 0.30
            // } else if (this.downPaymentSelect == 35) {
            //     dp = 0.35
            // } else if (this.downPaymentSelect == 40) {
            //     dp = 0.40
            // } else if (this.downPaymentSelect == 45) {
            //     dp = 0.45
            // } else if (this.downPaymentSelect == 50) {
            //     dp = 0.50
            // } else if (this.downPaymentSelect == 55) {
            //     dp = 0.55
            // } else if (this.downPaymentSelect == 60) {
            //     dp = 0.60
            // }

            this.downPayment = this.unitPrice * (this.downPaymentSelect/100).toFixed(2);

            this.amountFinancedPercent = 100 - this.downPaymentSelect;
            
            this.amountFinanced = this.unitPrice - this.downPayment;

            this.oneYear = this.amountFinanced * 1.1285 / 12;
            this.twoYears = this.amountFinanced * 1.3260 / 24;
            this.threeYears = this.amountFinanced * 1.4290 / 36;
            this.fourYears = this.amountFinanced * 1.5440 / 48;

            let downpayment = this.downPayment;
            let chattel = this.chattel;
            let insurance = this.insurance;
            let others = this.others;

            this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);

            console.log(this.downPayment)
        },
        computeCustom() {

            if (!this.$refs.form.validate()) {
                return;
            }

            this.isResultDialog = true;

            this.downPayment = this.dpCustom;
            this.amountFinanced = this.unitPrice - this.downPayment;

            // this.downPayment = this.unitPrice * (this.dpCustom/100).toFixed(2);

            this.oneYear = this.amountFinanced * 1.1285 / 12;
            this.twoYears = this.amountFinanced * 1.3260 / 24;
            this.threeYears = this.amountFinanced * 1.4290 / 36;
            this.fourYears = this.amountFinanced * 1.5440 / 48;

            let downpayment = this.downPayment;
            let chattel = this.chattel;
            let insurance = this.insurance;
            let others = this.others;

            this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);

            console.log(this.totalEstCashout)
        },
        computeJockUp() {
            if (!this.$refs.form.validate()) {
                return;
            }

            this.isResultDialog = true;
            this.amountFinanced = this.jockUpPrice * 0.70;
            this.downPayment = this.origPrice - this.amountFinanced;

            this.oneYear = this.amountFinanced * 1.1285 / 12;
            this.twoYears = this.amountFinanced * 1.3260 / 24;
            this.threeYears = this.amountFinanced * 1.4290 / 36;
            this.fourYears = this.amountFinanced * 1.5440 / 48;

            let downpayment = this.downPayment;
            let chattel = this.chattel;
            let insurance = this.insurance;
            let others = this.others;

            this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);
        },
        reset() {
            this.$refs.form.resetValidation()
        },
        formatPrice(value) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2
            });
            return formatter.format(value);
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
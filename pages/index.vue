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
                            :items="['JACCS','Security Bank','Maybank','Malayan Bank','Brand New']"
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
                                    label="Jack-up Price"
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
                            label="Others"
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
                        <div><b>Terms:</b></div>
                        <!-- <div><b>12 Months:</b> {{ formatPrice(oneYear) }}</div> -->
                        <div><b>24 Months:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months:</b> {{ formatPrice(threeYears) }}</div>
                        <div><b>48 Months:</b> {{ formatPrice(fourYears) }}</div>
                        <blockquote class="blockquote pa-0">
                            <footer>
                                <small>
                                    <em>* Aside from the Down Payment, you will pay for the Chattel and Comprehensive Insurance with acts of nature.</em>
                                </small>
                            </footer>
                        </blockquote>
                        <div v-if="chattel != 0"><b>CMF:</b> {{ formatPrice(chattel) }}</div>
                        <div v-if="insurance != 0"><b>Insurance with AOG:</b> {{ formatPrice(insurance) }}</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text">ESTIMATED CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
                    </div>
                    <div v-else class="result mt-3">
                        <div><h3>{{ unitDetails }}</h3></div>
                        <div><b>Unit Price:</b> {{ formatPrice(unitPrice) }}</div>
                        <div><b><span v-if="!isJackUp && !isCustom">{{ downPaymentSelect }}%</span> Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                        <div><b><span v-if="!isJackUp && !isCustom">{{ amountFinancedPercent }}%</span> Amount Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                        <div><b>Terms:</b></div>
                        <!-- <div v-if="bank != 'Brand New'"><b>12 Months:</b> {{ formatPrice(oneYear) }}</div> -->
                        <div><b>24 Months:</b> {{ formatPrice(twoYears) }}</div>
                        <div><b>36 Months:</b> {{ formatPrice(threeYears) }}</div>
                        <div><b>48 Months:</b> {{ formatPrice(fourYears) }}</div>
                        <div v-if="bank == 'Brand New'"><b>60 Months:</b> {{ formatPrice(fiveYears) }}</div>
                        <blockquote class="blockquote pa-0">
                            <footer>
                                <small>
                                    <em>* Aside from the Down Payment, you will pay for the Chattel and Comprehensive Insurance with acts of nature.</em>
                                </small>
                            </footer>
                        </blockquote>
                        <div v-if="chattel != 0"><b>Chattel Mortgage Fee:</b> {{ formatPrice(chattel) }} Estimated only</div>
                        <div v-if="insurance != 0"><b>Insurance with AOG:</b> {{ formatPrice(insurance) }} Estimated only</div>
                        <div v-if="others != 0"><b>Others:</b> {{ formatPrice(others) }}</div>
                        <h3 class="red--text">ESTIMATED CASHOUT: {{ formatPrice(totalEstCashout) }}</h3>
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
        banks: [
            { jaccs: ['1.1285','1.3260','1.4290','1.5440'] }
        ],
        amountFinancedPercent: null,
        amountFinanced: null,
        terms: '',
        // oneYear: null,
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
            {
                af: '300K - 450K',
                cmf: '24,000',
                ins: '29,000'
            },
            {
                af: '490K',
                cmf: '25,000',
                ins: '30,000'
            },
            {
                af: '500K',
                cmf: '27,000',
                ins: '32,000'
            },
            {
                af: '750K - 800K',
                cmf: '30,000',
                ins: '35,000'
            },
            {
                af: '1.1M',
                cmf: '40,000',
                ins: '38,000'
            },
        ],
    }),
    methods: {
        compute() {

            if (!this.$refs.form.validate()) {
                return;
            }

            this.isResultDialog = true;

            this.downPayment = this.unitPrice * (this.downPaymentSelect/100).toFixed(2);

            this.amountFinancedPercent = 100 - this.downPaymentSelect;
            
            this.amountFinanced = this.unitPrice - this.downPayment;

            if(this.bank == 'JACCS') {
                // this.oneYear = this.amountFinanced * 1.1285 / 12;
                this.twoYears = this.amountFinanced * 1.3260 / 24;
                this.threeYears = this.amountFinanced * 1.4290 / 36;
                this.fourYears = this.amountFinanced * 1.5440 / 48;
            } else if (this.bank == 'Security Bank') {
                // this.oneYear = this.amountFinanced * 1.1089 / 12;
                this.twoYears = this.amountFinanced * 1.3017 / 24;
                this.threeYears = this.amountFinanced * 1.4027 / 36;
                this.fourYears = this.amountFinanced * 1.5229 / 48;
            } else if (this.bank == 'Maybank') {
                // this.oneYear = this.amountFinanced * 1.1197 / 12;
                this.twoYears = this.amountFinanced * 1.3188 / 24;
                this.threeYears = this.amountFinanced * 1.4151 / 36;
                this.fourYears = this.amountFinanced * 1.5225 / 48;
            } else if (this.bank == 'Malayan Bank') {
                // this.oneYear = this.amountFinanced * 1.1302 / 12;
                this.twoYears = this.amountFinanced * 1.2780 / 24;
                this.threeYears = this.amountFinanced * 1.3682 / 36;
                this.fourYears = this.amountFinanced * 1.4691 / 48;
            } else if (this.bank == 'Brand New') {
                this.twoYears = this.amountFinanced * 1.2626 / 24;
                this.threeYears = this.amountFinanced * 1.3858 / 36;
                this.fourYears = this.amountFinanced * 1.4618 / 48;
                this.fiveYears = this.amountFinanced * 1.5394 / 60;
            }

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

            // this.oneYear = this.amountFinanced * 1.1285 / 12;
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
        computeJackUp() {
            if (!this.$refs.form.validate()) {
                return;
            }

            this.isResultDialog = true;

            let origprice = this.origPrice;
            let jackupprice = this.jackUpPrice;
            
            this.jackUpPriceTotal = parseInt(origprice) + parseInt(jackupprice);

            this.amountFinanced = this.jackUpPriceTotal * (this.jackUpAF/100).toFixed(2);
            this.downPayment = this.origPrice - this.amountFinanced;

            // this.oneYear = this.amountFinanced * 1.1285 / 12;
            this.twoYears = this.amountFinanced * 1.3260 / 24;
            this.threeYears = this.amountFinanced * 1.4290 / 36;
            this.fourYears = this.amountFinanced * 1.5440 / 48;

            let downpayment = this.downPayment;
            let chattel = this.chattel;
            let insurance = this.insurance;
            let others = this.others;
            
            console.log(this.jackUpPriceTotal)


            this.totalEstCashout = parseInt(downpayment) + parseInt(chattel) + parseInt(insurance) + parseInt(others);
        },
        clear() {
            this.$refs.form.resetValidation();
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

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
                            v-model="unitPrice"
                            label="Unit Price"
                            outlined
                            placeholder="Php 0.0"
                            :rules="rules"
                        ></v-text-field>
                        <v-combobox
                            v-model="downPaymentSelect"
                            :items="downPaymentSelectItems"
                            prepend-inner-icon="mdi-percent"
                            label="Down Payment"
                            placeholder="0%"
                            outlined
                            :rules="rules"
                        ></v-combobox>
                        <v-text-field
                            v-model="chattel"
                            label="Chattel Mortgage Fee"
                            outlined
                            placeholder="0.0"
                        ></v-text-field>
                        <v-text-field
                            v-model="insurance"
                            label="Insurance with AOG"
                            outlined
                            placeholder="0.0"
                        ></v-text-field>
                        <v-text-field
                            v-model="others"
                            label="Others"
                            outlined
                            placeholder="0.0"
                        ></v-text-field>
                        <div class="result">
                            <h2>Sample Quotation</h2>
                            <div><b>Unit Price:</b> {{ formatPrice(unitPrice) }}</div>
                            <div><b>Down Payment:</b> {{ formatPrice(downPayment) }}</div>
                            <div><b>Financed:</b> {{ formatPrice(amountFinanced) }}</div>
                            <div><b>Terms:</b></div>
                            <div><b>12 Months:</b> {{ formatPrice(oneYear) }}</div>
                            <div><b>24 Months:</b> {{ formatPrice(twoYears) }}</div>
                            <div><b>36 Months:</b> {{ formatPrice(threeYears) }}</div>
                            <div><b>48 Months:</b> {{ formatPrice(fourYears) }}</div>
                            <div><b>CMF:</b> {{ formatPrice(chattel) }}</div>
                            <div><b>Insurance with AOG:</b> {{ formatPrice(insurance) }}</div>
                            <div><b>Others:</b> {{ formatPrice(others) }}</div>
                            <div><h3 class="red--text">Total Estimated Cashout: {{ formatPrice(totalEstCashout) }}</h3></div>
                        </div>
                    </v-form>
                    <v-btn @click="compute()" color="primary" class="mt-3" block>
                        Compute
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        valid: true,
        rules: [
            value => !!value || 'Required.',
        ],
        unitPrice: null,
        chattel: null,
        insurance: null,
        others: null,
        totalEstCashout: null,
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

            let dp = 0;

            if (this.downPaymentSelect == 20) 
            {
                dp = 0.20
            } else if (this.downPaymentSelect == 25) {
                dp = 0.25
            } else if (this.downPaymentSelect == 30) {
                dp = 0.30
            } else if (this.downPaymentSelect == 35) {
                dp = 0.35
            } else if (this.downPaymentSelect == 40) {
                dp = 0.40
            } else if (this.downPaymentSelect == 45) {
                dp = 0.45
            } else if (this.downPaymentSelect == 50) {
                dp = 0.50
            } else if (this.downPaymentSelect == 55) {
                dp = 0.55
            } else if (this.downPaymentSelect == 60) {
                dp = 0.60
            }

            this.downPayment = this.unitPrice * dp;

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
    border: 1px solid rgba(#000, .1);
    padding: 1rem;
}
</style>
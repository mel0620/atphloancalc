<template>
    <v-row>
        <v-col class="text-center">
            <v-data-table
                title="CMF and Insurance Estimate"
                :headers="headers"
                :items="estimates"
                :items-per-page="5"
                class="elevation-1 mt-4"
            ></v-data-table>
        </v-col>
    </v-row>
</template>
<script>
export default {
    data () {
        return {
            headers: [
                {
                    text: 'Amount Financed',
                    align: 'center',
                    value: 'af',
                },
                { text: 'CMF', align: 'center', value: 'cmf' },
                { text: 'Insurance with AOG', align: 'center', value: 'ins' },
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
        }
    },
}
</script>
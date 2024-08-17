import * as Services from '../db/daoManager';
import mongoose from "mongoose";
import { ICommonInterface } from '../interfaces/common.interface';

export class BaseEntity {
    public ObjectId = mongoose.Types.ObjectId;
    public DAOManager: any = new Services.DAOManager();
    protected modelName: ModelNames | any;
    constructor(modelName?) {
        this.modelName = modelName;
    }
    async paginateAggregate(model: ModelNames, pipeline: any[], options: any = {}): Promise<ICommonInterface.PaginationResult> {
        try {
            if (options.getCount) {

                pipeline.push({
                    $facet: {
                        'total': [{ $count: 'count' }],
                        'result': [{ $skip: (options.page - 1) * options.limit }, { $limit: options.limit }]
                    }
                });

                console.log("Pipline>>>>>>>>>>>>>>>>>>>>>>>>>.",pipeline)

                // aggregate and check if current records are greater than total records
                let aggregateData = await this.DAOManager.aggregateData(model, pipeline);

                if (aggregateData.length) {
                    if (aggregateData[0].result.length) {
                        let paginationResult: any = { next: false, page: options.page, limit: options.limit, total: aggregateData[0].total[0].count };
                        if ((options.limit * options.page) < paginationResult.total) {
                            paginationResult.next = true;
                        }
                        paginationResult.data = aggregateData[0].result;
                        return paginationResult;
                    } else return { next: false, data: [], page: options.page, total: aggregateData[0].total.length ? aggregateData[0].total[0].count : 0, limit: options.limit }
                } else throw new Error('Error in paginate aggregation pipeline');
            } else {
                // if ranged documents are required, `options.ranged` should contain the expression
                if (options.range) pipeline.push({ $match: options.range })
                // else use the default pagination logic
                else pipeline.push({ $skip: (options.page - 1) * options.limit });
                pipeline.push({ $limit: options.limit + 1 });
                console.log(JSON.stringify(pipeline));
                // aggregate and check if more records exists when greater than limit
                let aggregateData = await this.DAOManager.aggregateData(model, pipeline);
                if (aggregateData.length) {
                    let paginationResult: any = { next: false, page: options.page };
                    if (aggregateData.length > options.limit) {
                        paginationResult.next = true;
                        paginationResult.data = aggregateData.slice(0, aggregateData.length - 1);
                    } else paginationResult.data = aggregateData;
                    return paginationResult;
                } else return { next: false, data: [], page: options.page, limit: options.limit }
            }
        } catch (error) {
            console.error(error, "paginate aggregate error");
        }
        // if total records count is required, options.getCount should be true

    }

    /**
      * @name exportAggregate
      * @description Find data in pagination using the aggregate method
     */
    async exportAggregate(model: ModelNames, pipeline1: any[]) {
        try {
            let pipeline = [];
            pipeline.push(...pipeline1);
            let paginatedResult = await this.DAOManager.aggregateData(model, pipeline);
            return { totalRecords: paginatedResult.length, data: paginatedResult };
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async paginateAggregateLookup(model: ModelNames, pipeline: any[], options: any = {}): Promise<ICommonInterface.PaginationResult> {
        console.log(JSON.stringify(pipeline));
        let aggregateData = await this.DAOManager.aggregateData(model, pipeline);
        if (aggregateData.length) {
            let paginationResult: any = { next: false, page: options.page, limit: options.limit };
            if (aggregateData.length > options.limit) {
                paginationResult.next = true;
                paginationResult.data = aggregateData.slice(0, aggregateData.length - 1);
            } else paginationResult.data = aggregateData;
            return paginationResult;
        } else return { next: false, data: [], page: options.page, limit: options.limit }


    }

    
    async createOneEntity(saveData: Object, allowDuplicateError?) {
        try {
            console.log('sssssssss -> this.modelName ->      --- ', this.modelName, saveData);
            let data = await this.DAOManager.saveData(this.modelName, saveData)
            return data
        } catch (error) {
            console.log(error, "error--------------");
            if (error.code == 11000 && allowDuplicateError === true) {
                return { 'documentAlreadyExists': true }
            }
            else {
                console.log("Error in Base Entity createOneEntity  ", this.modelName, error)
                return Promise.reject(error)
            }
        }

    }

    async createManyEntity(saveData: any) {
        try {
            let data = await this.DAOManager.insertMany(this.modelName, saveData)
            return data
        } catch (error) {
            console.log("Error in Base Entity createManyEntity  ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async findOneAndDelete(query: string, options) {
        try {
            let data = await this.DAOManager.findOneAndDelete(this.modelName, query, options)
            return data;
        } catch (error) {
            console.log("Error in Base Entity removeOneEntity  ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async removeOneEntity(criteria: Object) {
        try {
            let data = await this.DAOManager.remove(this.modelName, criteria)
            return data
        } catch (error) {
            console.log("Error in Base Entity removeOneEntity  ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getOneEntity(criteria: Object, projection: Object, sortBy?, sortType?) {
        try {
            let data;
            data = await this.DAOManager.findOne(this.modelName, criteria, projection, { lean: true });
            return data
        } catch (error) {
            console.log("Error in Base Entity getOneEntity ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async updateOne(criteria: Object, dataToUpdate: Object, option?) {
        try {
            if (option == undefined)
                option = { new: true, lean: true }
            let data = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, option)
            return data
        } catch (error) {
            console.log("Error in Base Entity updateOneEntity ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async getById(_id: string, projection: Object) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, { _id: _id }, projection, { lean: true })
            return data
        } catch (error) {
            console.log("Error in Base Entity getById ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getMultiple(criteria: Object, projection: Object) {
        try {
            let data = await this.DAOManager.getData(this.modelName, criteria, projection, { lean: true })
            return data
        } catch (error) {
            console.log("Error in Base Entity getMultiple ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async updateMultiple(criteria: Object, projection: Object, option?) {
        try {
            if (option == undefined)
                option = { new: true, multi: true }
            let data = await this.DAOManager.updateMany(this.modelName, criteria, projection, option)
            return data
        } catch (error) {
            console.log("Error in Base Entity updateMultiple ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getOneEntityWithSort(criteria: Object) {
        try {
            let data;
            data = await this.DAOManager.find(criteria).sort({ "itemInfo.updatedAt": -1 }).limit(1);
            data = data.length > 0 ? data[0] : null;
            return data
        } catch (error) {
            console.log("Error in Base Entity getOneEntity ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async nFormatter(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

}
// @ts-nocheck
'use strict';
import Models from '../models';
import mongoose from "mongoose";

export class DAOManager {
    public ObjectId = mongoose.Types.ObjectId;
    constructor() {

    }

    async getSortedEntities(modelName: ModelNames, criteria: Object, projection: Object, sortData?) {
        try {
            let data;
            console.log("Error in Base Entity getOneEntity ", sortData)
            let ModelName = Models[modelName]
            data = await ModelName.find(criteria, projection).sort(sortData).lean().exec();//.limit(1);
            data = data.length > 0 ? data : null;
            return data
        } catch (error) {
            console.log("Error in Base Entity getOneEntity ", error)
            return Promise.reject(error)
        }

    }

    async getSortedEntitiesWithLimit(modelName: ModelNames, criteria: Object, projection: Object, limit, sortData?) {
        try {
            let data;
            console.log("Error in Base Entity getOneEntity ", sortData)
            let ModelName = Models[modelName]
            data = await ModelName.find(criteria, projection).sort(sortData).limit(limit).lean().exec();
            data = data.length > 0 ? data : null;
            return data
        } catch (error) {
            console.log("Error in Base Entity getOneEntity ", error)
            return Promise.reject(error)
        }

    }

    async saveData(model: ModelNames, data: any) {
        try {
            let ModelName = Models[model]
            return await new ModelName(data).save();
        }
        catch (error) {
            return Promise.reject(error);
        }
    };

    async getData(model: ModelNames, query: any, projection: any, options: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.find(query, projection, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async distinct(model: ModelNames, path: string, query: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.distinct(path, query);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findOneAndDelete(model: ModelNames, query: any, options: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOneAndDelete(query, options).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async findOne(model: ModelNames, query, projection, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOne(query, projection, options).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };
    async findAll(model: ModelNames, query, projection, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.find(query, projection, options).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findAndUpdate(model: ModelNames, conditions, update, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOneAndUpdate(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };
    async findByIdAndUpdate(model: ModelNames, conditions, update, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.findByIdAndUpdate(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    }
    async findAndRemove(model: ModelNames, conditions, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOneAndRemove(conditions, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async updateOne(model: ModelNames, conditions: any, update: any, options: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.updateOne(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async updateMany(model: ModelNames, conditions, update, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.updateMany(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async remove(model: ModelNames, condition) {
        try {
            let ModelName = Models[model]
            let removeDocument = await ModelName.deleteOne(condition);
            return removeDocument;
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async removeAll(model: ModelNames, condition) {
        try {
            let ModelName = Models[model]
            let removeDocument = await ModelName.deleteMany(condition);
            return removeDocument;
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async populateData(model: ModelNames, query, projection, options, collectionOptions) {
        try {
            let ModelName = Models[model];
            return await ModelName.find(query, projection, options).populate(collectionOptions).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async count(model: ModelNames, condition) {
        try {
            let ModelName = Models[model]
            return await ModelName.countDocuments(condition);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async aggregateData(model: ModelNames, aggregateArray, options) {
        try {
            let ModelName = Models[model]
            let aggregation = ModelName.aggregate(aggregateArray);
            if (options) { aggregation.options = options; }
            return await aggregation.exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };



    async findAndPaginate(model: ModelNames, criteria, skip, limit, options?) {
        try {

            let ModelName = Models[model]
            let query = ModelName.find(criteria).skip(skip).limit(limit)
            options ? query.options = options : ""
            return await query.exec();
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async findAndSort(model: ModelNames, criteria, projection, sort, options?) {
        try {
            console.log(sort, '.xxxxxxxxxxxx')
            let ModelName = Models[model]
            let query = ModelName.find(criteria).sort({ priority: 1 });
            projection ? query.projection = projection : "";
            options ? query.options = options : ""
            return await query.exec();
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async findAndSortLimit(model: ModelNames, criteria, sort, options?) {
        try {
            let ModelName = Models[model]
            let query = ModelName.find(criteria).sort(sort).limit(1);
            options ? query.options = options : "";
            console.log(query)

            return await query.exec();
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async insert(model: ModelNames, data, options = {}) {
        try {
            let ModelName = Models[model]
            let obj = new ModelName(data)
            await obj.save()
            return obj
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async insertMany(model: ModelNames, data, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.insertMany(data, options);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    async aggregateDataWithPopulate(model: ModelNames, group, populateOptions) {
        try {
            let ModelName = Models[model]
            let aggregate = await ModelName.aggregate(group);
            let populate = await ModelName.populate(aggregate, populateOptions)
            return populate
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async populateDataOnAggregate(model: ModelNames, aggregate, populateOptions) {
        try {
            let ModelName = Models[model]
            return await ModelName.populate(aggregate, populateOptions)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async bulkWrite(model, operations, options) {
        try {

            let ModelName = Models[model]
            return await ModelName.bulkWrite(operations, options)

        } catch (error) {
            return Promise.reject(error)
        }
    };

    async bulkFindAndUpdateOne(bulk, query, update, options) {
        try {
            return await bulk.find(query).upsert().updateOne(update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };
};
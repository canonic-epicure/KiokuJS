Class('JiojuDB.Reference', {
    
    has : {
        ID          : { required : true }
    }
    
});
Role('JiojuDB.Serializer', {
    
    requires : [ 'serialize', 'deserialize' ]
})

;
Class('JiojuDB.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        results     : Joose.I.Array,
        
        result      : null
    },
    
        
    methods : {
        
        serialize   : function (data) {
            this.seen       = {}
            this.result     = []
            
            this.visit(data)
            
            return this.result.join('')
        },
        
        
        deserialize : function (string) {
            return eval(string)
        },
        
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitValue : function (value) {
            this.write(typeof value == 'string' ? '"' + value.replace(/\"/g, '\\"') + '"' : value)
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '":')
        }
    },
    
    
    before : {
        visitObject : function () {
            this.write('{')
        },
        
        
        visitArray : function () {
            this.write('[')
        }
    },
    
    
    after : {
        visitObject : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write('}')
        },
        
        
        visitArray : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write(']')
        },
        
        
        visitObjectValue : function () {
            this.write(',')
        },
        
        
        visitArrayEntry : function () {
            this.write(',')
        }
    }
})
;
Class('JiojuDB.Serializer.JSPON', {
    
    isa         : 'JiojuDB.Serializer.JSON',
    
    does        : 'JiojuDB.Serializer',
    
    use         : 'JiojuDB.Reference',
    
    
    methods : {
        
        visitJooseInstance : function (reference, className) {
            if (!(reference instanceof JiojuDB.Reference)) throw "Invalid Joose instance [" + reference + "] encountered during serialization"
            
            return this.visit({
                '$ref' : reference.ID
            })
        }
    }
    
})
;

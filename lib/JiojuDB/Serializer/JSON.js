Class('JiojuDB.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    does        : 'JiojuDB.Serializer',
    
    
    has : {
        result      : null
    },
    
        
    methods : {
        
        serialize   : function (node) {
            if (!node.firstClass) throw "Can't serialize node [" + node + "] - not firstClass"
            
            this.seen       = {}
            this.result     = []
            
            this.visit(node.getEntry(true))
            
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

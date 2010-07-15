Class('KiokuJS.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    does        : 'KiokuJS.Role.Serializer',
    

    has : {
        result      : Joose.I.Array
    },
    
        
    methods : {
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitValue : function (value) {
            this.write(typeof value == 'string' ? '"' + value.replace(/\"/g, '\\"') + '"' : value + '')
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '":')
        },
        
        
        markSeenAs    : function (object) {
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
    },
    
    
    my : {
        
        methods : {
            
            serialize   : function (data) {
                var instance = new this.HOST()
                
                instance.visit(data)
                
                return instance.result.join('')
            },
            
            
            deserialize : function (string) {
                return eval("var res = " + string + "; res")
            }
        } 
    }
})

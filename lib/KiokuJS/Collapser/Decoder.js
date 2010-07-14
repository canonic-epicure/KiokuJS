Class('KiokuJS.Collapser.Decoder', {
    
    isa         : 'Data.Visitor',
    

    has         : {
        backend         : { required : true },
        
        reservedKeys    : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            throw "Joose instance [" + node + "] encountered during decoding - data should contain only native structures"
        },
        
        
        // a bit faster visiting of array
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var refID = object.$ref
            
            if (refID)
                return new KiokuJS.Reference({
                    ID  : refID
                })
            
            if (object.$entry) {
                delete object.$entry
                
                return this.backend.getNodeFromEntry(object)
            }
            
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                if (/^public:/.test(key)) {
                    var reservedKey = key.replace(/^public:/, '')
                    
                    if (this.reservedKeys.test(reservedKey)) key = reservedKey
                }
                
                res[ key ] = this.visit(value)
                
            }, this)
            
            return res
        }
    },
    
    
    my : {

        methods : {
            
            decodeNodes : function (data, backend) {
                var instance = new this.HOST({
                    backend : backend
                })
                
                return instance.visit(data)
            }
        }                    
    }
})

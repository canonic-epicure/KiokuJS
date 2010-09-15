Class('KiokuJS.Linker.Decoder', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    

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
//                delete object.$entry
                
                return this.backend.createNodeFromEntry(this.visitNativeObject(object, className))
            }
            
            return this.visitNativeObject(object, className)
        },
        
        
        visitNativeObject : function (object, className) {
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
            
            decodeEntries : function (entries, backend) {
                var instance = new this.HOST({
                    backend : backend
                })
                
                return instance.visit(entries)
            }
        }                    
    }
})
